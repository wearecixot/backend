import { Module } from "@nestjs/common";
import RewardService from "./reward.service";
import RewardController from "./reward.controller";

@Module({
    imports: [],
    controllers: [RewardController],
    providers: [RewardService],
})
export default class RewardModule {}