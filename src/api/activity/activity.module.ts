import { Module } from "@nestjs/common";
import ActivitiesService from "./activity.service";
import ActivitiesController from "./activity.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserActivityEntity } from "src/model/user-activities.entity";
import { UserEntity } from "src/model/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        UserActivityEntity,
        UserEntity
    ])],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports: [ActivitiesService]
})
export default class ActivitiesModule {}