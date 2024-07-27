import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import ActivitiesService from "./activities.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { Request } from "express";

@Controller('activities')
export default class ActivitiesController {
    // constructor(
    //     private readonly activitiesService: ActivitiesService
    // ) {}

    @UseGuards(JwtAuthGuard)
    @Get('history')
    async getActivitiesHistory(@Req() request: Request) {
        const user = request.user;

        // return this.activitiesService.getActivitiesHistory(user.id as string);
    }

    @UseGuards(JwtAuthGuard)
    @Get('test')
    async testJwt(@Req() request: Request) {
        const user = request.user;

        console.log(user)
        return "asuk"
        // return this.activitiesService.getActivitiesHistory(user.id as string);
    }
}