import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import RewardEntity from "./reward.entity";
import ClaimedRewardEntity from "./claimed-reward.entity";

export enum Activity {
    RUN = 'RUN',
    BICYCLE = 'BICYCLE',
    PUBLIC_TRANSPORT = 'PUBLIC_TRANSPORT',
}

export enum ActivityType {
    IN = 'IN',
    OUT = 'OUT',
}

export interface ActivityData {
    calories?: number;
    distance?: number;
    in?: string;
    out?: string;
    rewardId?: string;
}

@Entity('user_activities')
export abstract class UserActivityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'timestamp' })
    timeStamp: Date;

    @Column({
        type: 'enum',
        enum: Activity,
        nullable: true
    })
    activity: Activity;

    @Column({ type: 'double precision' })
    pointAmount: number;

    @ManyToOne(() => UserEntity, user => user.userActivities)
    user: UserEntity;

    @Column({ type: 'jsonb', nullable: true })
    activityData: ActivityData;

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        type: 'enum',
        enum: ActivityType,
    })
    type: ActivityType;

    @Column({ type: 'boolean', default: false })
    isPointClaimed: boolean;

    @OneToOne(() => ClaimedRewardEntity, reward => reward.userActivity)
    claimedReward: ClaimedRewardEntity;

}