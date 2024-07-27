import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserActivityEntity } from "./user-activities.entity";
import { RewardTier } from "./reward.entity";
import ClaimedRewardEntity from "./claimed-reward.entity";

@Entity('users')
export abstract class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    fullName: string;

    @Column({ type: 'text', nullable: false})
    username: string;

    @Column({ type: 'text', nullable: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    password: string;

    @Column({ type: 'text', nullable: true })
    phoneNumber: string;

    @Column({ type: 'double precision', default: 0 })
    balance: number;

    @Column({ type: 'text', nullable: true })
    stravaId: string;

    @Column({ type: 'text', nullable: true })
    stravaRefreshToken: string;

    @Column({ type: 'jsonb', nullable: true })
    stravaMetadata: StravaMetadata

    @Column({ type: 'text', nullable: true })
    profile: string;

    @Column({type: 'enum', enum: RewardTier, default: RewardTier.ONE})
    tier: RewardTier;

    @OneToMany(() => UserActivityEntity, userActivities => userActivities.user)
    userActivities: UserActivityEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastActivity: Date;

    @Column({ type: 'integer', default: 0 })
    tierProgress: number;

    @OneToMany(() => ClaimedRewardEntity, claimedReward => claimedReward.user)
    claimedRewards: ClaimedRewardEntity[];

}


export interface StravaMetadata {
    athlete: {
        id: number,
        username: string,
        resource_state: number,
        firstname: string,
        lastname: string,
        bio: null | string,
        city: null | string,
        state: null | string,
        country: null | string,
        sex: null | string,
        premium: boolean,
        summit: boolean,
        created_at: string,
        updated_at: string,
        badge_type_id: number,
        weight: null | number,
        profile_medium: string,
        profile: string,
        friend: number,
        follower: number
    }
}