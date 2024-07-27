import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import ActivitiesService from "./activity.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { Request } from "express";

@Controller('activities')
export default class ActivitiesController {
    constructor(
        private readonly activitiesService: ActivitiesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getActivitiesHistory(@Req() request: Request) {
        const user = request.user;

        return this.activitiesService.getActivitiesHistory((user as any).id as string);
    }

    @UseGuards(JwtAuthGuard)
    @Post('claim-points/:activityId')
    async claimPoints(@Req() request: Request, @Param('activityId') activityId: string) {
        const user = request.user;
        return this.activitiesService.claimPoints((user as any).id as string, activityId);
    }

}