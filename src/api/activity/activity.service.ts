import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Activity, ActivityData, ActivityType, UserActivityEntity } from "src/model/user-activities.entity";
import { UserEntity } from "src/model/user.entity";
import { Repository } from "typeorm";

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
            }
        })

        return activities;
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
            totalCalories: 0, // TODO: create logic for deriving total calories
            tier: user.tier,
            tierProgress: user.tierProgress % 10,
        }
    }

    async addActivity(userId: string, activity: Activity, points: number, type: ActivityType, timestamp: string, activityData?: ActivityData) {
        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if(activity === Activity.PUBLIC_TRANSPORT) {
            if(!activityData.in || !activityData.out) {
                throw new BadRequestException('Public transport activity must have in and out data');
            }
        }

        if(activity === Activity.RUN || activity === Activity.BICYCLE) {
            if(!activityData.distance || !activityData.calories) {
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
            activityData: {
                calories: activityData?.calories || 0,
                distance: activityData?.distance || 0,
                in: activityData?.in || '',
                out: activityData?.out || ''
            }
        })

        await this.activityRepo.save(newActivity);

        await this.userRepo.update({
            id: userId
        }, {
            lastActivity: new Date(),
            tierProgress: user.tierProgress + 1
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

}