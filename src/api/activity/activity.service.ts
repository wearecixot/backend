import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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
    ) {}

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

        if(!user) {
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

}