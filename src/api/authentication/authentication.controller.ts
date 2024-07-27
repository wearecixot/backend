import { BadRequestException, Controller,  Post, Query } from "@nestjs/common";
import AuthenticationService from "./authentication.service";
import { JwtAuthGuard } from "src/auth/guard/jwt.guard";

@Controller('auth')
export default class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService
    ) {}

    @Post('strava')
    async stravaLogin(@Query('code') code: string) {

        if(!code) {
            throw new BadRequestException('Code is required');   
        }

        return await this.authenticationService.stravaLogin(code);
    }
}