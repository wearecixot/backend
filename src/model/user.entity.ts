import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserActivityEntity } from "./user-activities.entity";
import { StravaEntity } from "./strava.entity";

@Entity('users')
export abstract class UserEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'text'})
    fullName: string;

    @Column({ type: 'text'})
    email: string;

    @Column({ type: 'text'})
    password: string;

    @Column({ type: 'text'})
    phoneNumber: string;

    @Column({ type: 'double precision'})
    balance: number;

    @Column({ type: 'text'})
    stravaId: string;

    @OneToMany(() => UserActivityEntity, userActivities => userActivities.user)
    userActivities: UserActivityEntity[];

    @OneToOne(()=> StravaEntity, strava => strava.user)
    strava: StravaEntity;

}