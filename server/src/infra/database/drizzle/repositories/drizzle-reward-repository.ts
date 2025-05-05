import { eq } from 'drizzle-orm'
import { db } from '..'
import type { RewardRepository } from '../../../../application/repositories/RewardRepository'
import { Reward } from '../../../../domain/entities/reward'
import { Code } from '../../../../domain/value-objects/Code'
import { FuryCoins } from '../../../../domain/value-objects/FuryCoins'
import { Name } from '../../../../domain/value-objects/Name'
import { Quantity } from '../../../../domain/value-objects/Quantity'
import { rewards } from '../schema/schema'

export class DrizzleRewardRepository implements RewardRepository {
  async create(reward: Reward): Promise<Reward> {
    await db.insert(rewards).values({
      code: reward.props.code.value,
      id: reward.id,
      name: reward.props.name.value,
      price: reward.props.price.value,
      quantity: reward.props.quantity.value,
    })

    return reward
  }

  async findByCode(code: Code): Promise<Reward | null> {
    const reward = await db.query.rewards.findFirst({
      where: eq(rewards.code, code.value),
    })

    if (!reward) return null

    return Reward.create(
      {
        code: Code.use(reward.code),
        name: Name.use(reward.name),
        price: FuryCoins.use(reward.price),
        quantity: Quantity.use(reward.quantity),
      },
      reward.id
    )
  }

  async updateQuantity(id: string, quantity: Quantity): Promise<Reward | null> {
    const reward = await db
      .update(rewards)
      .set({
        quantity: quantity.value,
      })
      .where(eq(rewards.id, id))
      .returning()

    if (reward.length === 0) return null

    return Reward.create(
      {
        code: Code.use(reward[0].code),
        name: Name.use(reward[0].name),
        price: FuryCoins.use(reward[0].price),
        quantity: Quantity.use(reward[0].quantity),
      },
      id
    )
  }
}
