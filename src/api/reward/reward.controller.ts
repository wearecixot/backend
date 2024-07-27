import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import RewardService from "./reward.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { Request } from "express";

@Controller('reward')
export default class RewardController {
    constructor(
        private readonly rewardService: RewardService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('redeem')
    async redeemReward(@Req() request: Request) {
        const user = request.user as any;

        return this.rewardService.redeemReward(user.id as string);
    }

    @Get('list')
    async getAllAvailableReward() {
        return this.rewardService.getAllAvailableRewards();
    }

}