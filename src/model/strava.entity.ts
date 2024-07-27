import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

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
        weight: null |number,
        profile_medium: string,
        profile: string,
        friend: number,
        follower: number
    }
}

@Entity('strava')
export abstract class StravaEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'text'})
    refreshToken: string;

    @Column({ type: 'jsonb'})
    metadata: StravaMetadata;

    @OneToOne(()=> UserEntity, user => user.strava)
    user: UserEntity;
}