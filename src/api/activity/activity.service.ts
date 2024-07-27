import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Activity, ActivityType, UserActivityEntity } from "src/model/user-activities.entity";
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

    async addActivity(userId: string, activity: Activity, points: number, type: ActivityType, timestamp: string) {
        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const newActivity = await this.activityRepo.create({
            pointAmount: points,
            type: type,
            activity: activity,
            user: user,
            createdAt: new Date(),
            timeStamp: timestamp,
        })

        await this.activityRepo.save(newActivity);

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

        return activity;
    }

}