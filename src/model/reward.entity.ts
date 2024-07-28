import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import ClaimedRewardEntity from "./claimed-reward.entity";
import { RewardTier } from "./reward.enum";



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