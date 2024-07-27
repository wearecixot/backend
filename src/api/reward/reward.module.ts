import { Module } from "@nestjs/common";
import RewardService from "./reward.service";
import RewardController from "./reward.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import RewardEntity from "src/model/reward.entity";
import { UserEntity } from "src/model/user.entity";
import ActivitiesModule from "../activity/activity.module";
import ClaimedRewardEntity from "src/model/claimed-reward.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
        RewardEntity,
        UserEntity,
        ClaimedRewardEntity
    ]), ActivitiesModule],
    controllers: [RewardController],
    providers: [RewardService],
})
export default class RewardModule {}