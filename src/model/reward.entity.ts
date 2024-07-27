import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import ClaimedRewardEntity from "./claimed-reward.entity";

export enum RewardTier {
    ONE = 'ONE',
    TWO = 'TWO',
    THREE = 'THREE',
}

@Entity('reward')
export default class RewardEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text'})
    name: string;

    @Column()
    stock: number;

    @Column({ type: 'text'})
    media: string;

    @Column()
    merchant: string;

    @Column({
        type: 'enum',
        enum: RewardTier,
    })
    tier: RewardTier;

    @OneToMany(() => ClaimedRewardEntity, claimedReward => claimedReward.reward)
    claimedRewards: ClaimedRewardEntity[];
}