import { Module } from "@nestjs/common";
import ActivitiesService from "./activities.service";
import ActivitiesController from "./activities.controller";
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