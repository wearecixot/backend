import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import ProfileService from "./profile.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";
import { Request } from "express";
import { UpdateProfileDto } from "./dto/profile.dto";

@Controller('profile')
export default class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getProfile(@Req() request: Request) {
        const user = request.user as any;

        return this.profileService.getProfile(user.id as string);
    }


    @UseGuards(JwtAuthGuard)
    @Put('')
    async updateProfile(@Req() request: Request, @Body() body: UpdateProfileDto) {
        const user = request.user as any;

        return this.profileService.updateProfile(user.id as string, body);
    }
}