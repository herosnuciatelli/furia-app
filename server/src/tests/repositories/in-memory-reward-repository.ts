import type { RewardRepository } from '../../application/repositories/RewardRepository'
import type { Reward } from '../../domain/entities/reward'
import type { Code } from '../../domain/value-objects/Code'
import type { Quantity } from '../../domain/value-objects/Quantity'

export class InMemoryRewardRepository implements RewardRepository {
  private items: Reward[] = []

  async create(reward: Reward): Promise<Reward> {
    this.items.push(reward)

    return reward
  }

  async findByCode(code: Code): Promise<Reward | null> {
    const reward = this.items.find(
      reward => reward.props.code.value === code.value
    )

    if (!reward) {
      return null
    }

    return reward
  }

  async findById(id: string): Promise<Reward | null> {
    const reward = this.items.find(reward => reward.id === id)

    if (!reward) {
      return null
    }

    return reward
  }

  async updateQuantity(id: string, quantity: Quantity): Promise<Reward | null> {
    const reward = await this.findById(id)

    if (!reward) return null

    reward.props.quantity.update(quantity.value)

    const newItems = this.items.map(item => {
      if (item.id === reward.id) {
        return reward
      }

      return item
    })

    this.items = newItems

    return reward
  }
}
