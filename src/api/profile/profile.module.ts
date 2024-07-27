import { Module } from "@nestjs/common";
import ProfileController from "./profile.controller";
import ProfileService from "./profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/model/user.entity";
import { UserActivityEntity } from "src/model/user-activities.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        UserEntity,
        UserActivityEntity
    ])],
    controllers: [ProfileController],
    providers: [ProfileService],
})
export default class ProfileModule {}