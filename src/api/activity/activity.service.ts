import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import * as dayjs from "dayjs";
import { RewardTier } from "../../model/reward.enum";
import { Activity, ActivityData, ActivityType, UserActivityEntity } from "../../model/user-activities.entity";
import { UserEntity } from "../../model/user.entity";
import { MoreThanOrEqual, Repository } from "typeorm";

@Injectable()
export default class ActivitiesService {
    constructor(
        @InjectRepository(UserActivityEntity)
        private readonly activityRepo: Repository<UserActivityEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) { }

    async getActivitiesHistory(userId: string) {
        const activities = await this.activityRepo.find({
            where: {
                user: {
                    id: userId
                }
            },
            order: {
                createdAt: 'DESC'
            },
            relations: {
                claimedReward: {
                    reward: true
                }
            }
        })


        const result = activities.map(activity => {
            return {
                id: activity.id,
                type: activity.type,
                name: activity.name,
                createdAt: activity.createdAt,
                amount: Math.abs(activity.pointAmount),
                isClaimed: activity.isPointClaimed,
                metadata: {
                    calories: activity.activityData?.calories || 0,
                    distance: activity.activityData?.distance || 0,
                    type: activity.activity,
                    merchant: activity.claimedReward?.reward?.merchant || '',
                    rewardName: activity.claimedReward?.reward?.name || '',
                    in: activity.activityData?.in || null,
                    out: activity.activityData?.out || null,
                }
            }
        })


        return result;
    }

    async getActivitiesHeader(userId: string) {
        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userActivities = await this.activityRepo.find({
            where: {
                user: {
                    id: userId
                }
            }
        })

        return {
            balance: user.balance,
            totalCommute: userActivities.filter(activity => activity.activity === Activity.PUBLIC_TRANSPORT).length,
            totalRun: userActivities.filter(activity => activity.activity === Activity.RUN).length,
            totalBicycle: userActivities.filter(activity => activity.activity === Activity.BICYCLE).length,
            totalCalories: await this.getAllUserCaloriesBurned(userId),
            tier: user.tier,
            tierProgress: user.tierProgress % 10,
        }
    }

    async addActivity(name: string, userId: string, activity: Activity, points: number, type: ActivityType, timestamp: string, activityData?: ActivityData) {
        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (activity === Activity.PUBLIC_TRANSPORT) {
            if (!activityData.in || !activityData.out) {
                throw new BadRequestException('Public transport activity must have in and out data');
            }
        }

        if (activity === Activity.RUN || activity === Activity.BICYCLE) {
            if (!activityData.distance || !activityData.calories) {
                throw new BadRequestException('Run and bicycle activity must have distance data and calories data');
            }
        }

        const newActivity = await this.activityRepo.create({
            pointAmount: points,
            type: type,
            activity: activity,
            user: user,
            createdAt: new Date(),
            timeStamp: timestamp,
            name: name,
            activityData: activityData ? {
                calories: activityData?.calories || 0,
                distance: activityData?.distance || 0,
                in: activityData?.in || '',
                out: activityData?.out || ''
            } : undefined
        })

        await this.activityRepo.save(newActivity);

        if (activity && (user.tierProgress + 1) % 10 === 0) {
            const userTier = user.tier
            let newTier = null;

            switch (userTier) {
                case 'ONE':
                    newTier = RewardTier.TWO;
                    break;
                case 'TWO':
                    newTier = RewardTier.THREE;
                    break;
                case 'THREE':
                    newTier = RewardTier.THREE;
                    break;
            }

            await this.userRepo.update({
                id: userId
            }, {
                tier: newTier,
                tierProgress: 0
            })
        }

        await this.userRepo.update({
            id: userId
        }, {
            lastActivity: new Date(),
            tierProgress: user.tierProgress + (activity ? 1 : 0),
            balance: user.balance + points
        })


        return newActivity;
    }

    async claimPoints(activityId: string, userId: string) {
        const activity = await this.activityRepo.findOne({
            where: {
                id: activityId,
                user: {
                    id: userId
                }
            },
            relations: {
                user: true
            }
        })

        if (!activity) {
            throw new NotFoundException('Activity not found');
        }

        if (activity.isPointClaimed) {
            throw new BadRequestException('Points already claimed');
        }

        activity.isPointClaimed = true;

        await this.activityRepo.save(activity);

        await this.userRepo.update({
            id: activity.user.id
        }, {
            balance: activity.user.balance + activity.pointAmount
        })

        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })

        return {
            id: activityId,
            pointAmount: user.balance,
        }
    }

    async addPublicTransportActivity(userId: string) {
        const point = await this.calculatePoint(userId, Activity.PUBLIC_TRANSPORT, undefined);

        const { data } = await axios.get('https://www.comuline.com/api/trpc/schedule.getByStationId,schedule.getByStationId,schedule.getByStationId?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%22DP%22%7D%2C%221%22%3A%7B%22json%22%3A%22TNG%22%7D%2C%222%22%3A%7B%22json%22%3A%22boo%22%7D%7D')

        const line = data[0].result.data.json

        const randomIndex = Math.floor(Math.random() * line.length);

        const pickedLine = line[randomIndex];
        const inLocation = pickedLine['route'].split('-')[0]
        const outLocation = pickedLine['route'].split('-')[1]

        const res = await this.addActivity('KRL', userId, Activity.PUBLIC_TRANSPORT, point, ActivityType.IN, new Date().toISOString(), {
            calories: 0,
            distance: 0,
            in: inLocation,
            out: outLocation
        });

        return {
            id: res.id,
            pointAmount: res.pointAmount,
            in: inLocation,
            out: outLocation
        }
    }

    async addRunActivity(userId: string, distance: number) {



    }

    async calculatePoint(userId: string, activity: Activity, distance: number) {
        // distance in KM

        let point = 0;

        if (activity !== Activity.PUBLIC_TRANSPORT) {
            switch (activity) {
                case Activity.RUN:
                    point = distance * 50;
                    break;
                case Activity.BICYCLE:
                    point = distance * 25;
                    break;
            }
        } else {
            point = 30;
            let isThreeDaysConsicutivelyUsePublicTransport = true
            // check if its 3 consecutive day of public transport, if yes give 
            const ptActivities = await this.activityRepo.find({
                where: {
                    user: {
                        id: userId
                    },
                    activity: Activity.PUBLIC_TRANSPORT,
                    createdAt: MoreThanOrEqual(dayjs().subtract(3, 'day').toDate())
                }
            })

            for (let i = 0; i < 3; i++) {
                const currentDay = dayjs().subtract(i, 'day').toDate()

                // find if the user has public transport activity on that day
                const activity = ptActivities.find(activity => dayjs(activity.createdAt).isSame(currentDay, 'day'))
                if (!activity) {
                    isThreeDaysConsicutivelyUsePublicTransport = false
                    break;
                }
            }

            if (isThreeDaysConsicutivelyUsePublicTransport) {
                point = 40;
            }
        }
        return point;
    }

    async getAllUserCaloriesBurned(userId: string) {
        const activities = await this.activityRepo.find({
            where: {
                user: {
                    id: userId
                }
            }
        })

        const totalCalories = activities.reduce((acc, activity) => {
            if (activity.activity === Activity.RUN || activity.activity === Activity.BICYCLE) {
                acc += activity.activityData.calories;
            }
            return acc;
        }, 0)

        return totalCalories
    }

}