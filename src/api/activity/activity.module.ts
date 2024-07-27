import { Module } from "@nestjs/common";
import ActivitiesService from "./activity.service";
import ActivitiesController from "./activity.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserActivityEntity } from "src/model/user-activities.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        UserActivityEntity
    ])],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
})
export default class ActivitiesModule {}