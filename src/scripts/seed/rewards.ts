import RewardEntity, { RewardTier } from "../../../src/model/reward.entity"
import { DataSource } from "typeorm"
import { faker } from '@faker-js/faker';

const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'toxic',
    password: 'toxic2024',
    database: 'toxic_db',
    entities: [
        RewardEntity
    ]
})

const script = async () => {
    await dataSource.initialize()

    const rewards: RewardEntity[] = []

    for (let i = 0; i < 25; i++) {
        let t = RewardTier.ONE
        const tier = Math.floor(Math.random() * 3) + 1

        switch (tier) {
            case 1:
                t = RewardTier.ONE
                break
            case 2:
                t = RewardTier.TWO
                break
            case 3:
                t = RewardTier.THREE
                break
        }

        rewards.push({
            id: faker.string.uuid(),
            media: faker.image.url(),
            merchant: faker.company.name(),
            name: faker.commerce.product(),
            stock: 999,
            tier: t
        })
    }


    const rewardRepo = dataSource.manager.getRepository(RewardEntity)

    for (let i = 0; i < rewards.length; i++) {
        const r = rewardRepo.create(rewards[i])
        await rewardRepo.insert(r)
    }
}


script().then(() => {
    dataSource.destroy();
    console.log('Rewards seeded')
    process.exit(0)
}).catch((e) => {
    console.error(e)
    process.exit(1)
})