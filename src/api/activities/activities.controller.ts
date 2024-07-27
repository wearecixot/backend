import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import ActivitiesService from "./activities.service";
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

}