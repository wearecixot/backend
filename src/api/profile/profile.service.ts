import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ActivityType, UserActivityEntity } from "src/model/user-activities.entity";
import { UserEntity } from "src/model/user.entity";
import { Repository } from "typeorm";

@Injectable()
export default class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(UserActivityEntity)
        private readonly userActivityRepository: Repository<UserActivityEntity>
    ) { }

    async getProfile(userId: string) {
        const user = await this.userRepository.findOne({
            where: {
                id: userId,

            }
        })

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const rewardCount = await this.userActivityRepository.count({
            where: {
                user: {
                    id: userId
                },
                type: ActivityType.OUT
            }
        })

        return {
            fullName: user.fullName,
            userName: user.username,
            profilePicture: user.profile,
            points: user.balance,
            redeemedRewards: rewardCount
        }
    }
}