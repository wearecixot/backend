import { Module } from "@nestjs/common";
import RewardService from "./reward.service";
import RewardController from "./reward.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import RewardEntity from "src/model/reward.entity";
import { UserEntity } from "src/model/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        RewardEntity,
        UserEntity
    ])],
    controllers: [RewardController],
    providers: [RewardService],
})
export default class RewardModule {}