import { Module } from "@nestjs/common";
import AuthenticationController from "./authentication.controller";
import AuthenticationService from "./authentication.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/model/user.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([
        UserEntity,
        JwtModule
    ])],
    controllers: [AuthenticationController],
    providers: [AuthenticationService],
})
export default class AuthenticationModule {}