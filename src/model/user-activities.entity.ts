import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

export enum Activity {
    RUN = 'RUN',
    BICYCLE = 'BICYCLE',
    PUBLIC_TRANSPORT = 'PUBLIC_TRANSPORT',
}

export interface ActivityData {
    distance: number;
    duration: number;
    calories: number;
    steps: number;
}

@Entity('user_activities')
export abstract class UserActivityEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'timestamp' })
    timeStamp: Date;

    @Column({
        type: 'enum',
        enum: Activity,
    })
    activity: Activity;

    @Column({ type: 'double precision'})
    pointAmount: number;

    @ManyToOne(() => UserEntity, user => user.userActivities)
    user: UserEntity;

    @Column({type: 'jsonb'})
    activityData: ActivityData;
}