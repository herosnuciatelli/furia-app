import type { Reward } from '../../domain/entities/reward'
import type { Code } from '../../domain/value-objects/Code'
import type { Quantity } from '../../domain/value-objects/Quantity'

export interface RewardRepository {
  create(reward: Reward): Promise<Reward>
  findByCode(code: Code): Promise<Reward | null>
  updateQuantity(id: string, quantity: Quantity): Promise<Reward | null>
}
