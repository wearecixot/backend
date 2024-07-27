import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import RewardEntity, { RewardTier } from "src/model/reward.entity";
import { UserEntity } from "src/model/user.entity";
import { Repository } from "typeorm";
import ActivitiesService from "../activity/activity.service";
import { ActivityType } from "src/model/user-activities.entity";
import ClaimedRewardEntity from "src/model/claimed-reward.entity";
import { faker } from '@faker-js/faker';
import * as dayjs from "dayjs";

const REWARD_PRICE = {
    [RewardTier.ONE]: 100,
    [RewardTier.TWO]: 200,
    [RewardTier.THREE]: 300
}

@Injectable()
export default class RewardService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(RewardEntity)
        private readonly rewardRepo: Repository<RewardEntity>,
        @InjectRepository(ClaimedRewardEntity)
        private readonly claimedRewardRepo: Repository<ClaimedRewardEntity>,
        private readonly activityService: ActivitiesService,
    ) { }

    async redeemReward(userId: string) {
        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const rewards = await this.rewardRepo.find({
            where: {
                tier: user.tier
            }
        })

        if (user.balance < REWARD_PRICE[user.tier]) {
            throw new BadRequestException('Insufficient balance');
        }

        const randomIndex = Math.floor(Math.random() * rewards.length);

        const reward = rewards[randomIndex];


        await this.activityService.addActivity(
            user.id,
            undefined,
            REWARD_PRICE[user.tier] * -1,
            ActivityType.OUT,
            new Date().toISOString()
        )

        await this.claimedRewardRepo.insert({
            reward,
            user,
            timestamp: new Date().toISOString(),
            code: faker.string.alphanumeric(5),
            expiredDate: dayjs().add(14, 'day').toDate()
        })

        return {
            id: reward.id,
            name: reward.name,
            media: reward.media,
            merchant: reward.merchant,
            tier: reward.tier
        }
    }

    async getAllAvailableRewards() {
        return await this.rewardRepo.find({
            select: {
                id: true,
                media: true,
                merchant: true,
                name: true,
                tier: true
            }
        });
    }

    async getMyRewards(userId: string) {
        const user = await this.userRepo.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const claimedRewards = await this.claimedRewardRepo.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                reward: true
            }
        })

        return claimedRewards.map(r => ({
            id: r.reward.id,
            name: r.reward.name,
            media: r.reward.media,
            merchant: r.reward.merchant,
            tier: r.reward.tier,
            expiredDate: r.expiredDate,
            code: r.code
        }))
    }

}