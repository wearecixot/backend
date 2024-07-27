import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserActivityEntity } from "./user-activities.entity";

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

}