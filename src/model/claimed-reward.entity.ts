import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import RewardEntity from "./reward.entity";

@Entity('claimed-reward')
export default class ClaimedRewardEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, user => user.claimedRewards)
    user: UserEntity;

    @Column({ type: 'text' })
    timestamp: string;

    @ManyToOne(() => RewardEntity, reward => reward.claimedRewards)
    reward: RewardEntity;

    @Column({ type: 'timestamp'})
    expiredDate: Date;

    @Column()
    usedDate: Date;

    @Column()
    code: string;
}