import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import RewardEntity, { RewardTier } from "src/model/reward.entity";
import { UserEntity } from "src/model/user.entity";
import { Repository } from "typeorm";

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
        private readonly rewardRepo: Repository<RewardEntity>
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

        if(user.balance < REWARD_PRICE[user.tier]) {
            throw new BadRequestException('Insufficient balance');
        }

        const randomIndex = Math.floor(Math.random() * rewards.length);

        const reward = rewards[randomIndex];

        user.balance = user.balance - REWARD_PRICE[user.tier];

        await this.userRepo.save(user);

        return reward;
    }
}