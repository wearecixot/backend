import { Module } from "@nestjs/common";
import RewardService from "./reward.service";
import RewardController from "./reward.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import RewardEntity from "src/model/reward.entity";
import { UserEntity } from "src/model/user.entity";
import ActivitiesModule from "../activity/activity.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
        RewardEntity,
        UserEntity
    ]), ActivitiesModule],
    controllers: [RewardController],
    providers: [RewardService],
})
export default class RewardModule {}