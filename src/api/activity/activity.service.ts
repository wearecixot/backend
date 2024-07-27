import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserActivityEntity } from "src/model/user-activities.entity";
import { Repository } from "typeorm";

@Injectable()
export default class ActivitiesService {
    constructor(
        @InjectRepository(UserActivityEntity)
        private readonly activityRepo: Repository<UserActivityEntity>
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

}