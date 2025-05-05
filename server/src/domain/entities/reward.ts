import { Entity } from '../../core/domain/Entity'
import type { Code } from '../value-objects/Code'
import type { FuryCoins } from '../value-objects/FuryCoins'
import type { Name } from '../value-objects/Name'
import type { Quantity } from '../value-objects/Quantity'

interface RewardProps {
  quantity: Quantity
  name: Name
  code: Code
  price: FuryCoins
}

export class Reward extends Entity<RewardProps> {
  private constructor(props: RewardProps, id?: string) {
    super(props, id)
  }

  public static create(props: RewardProps, id?: string) {
    const reward = new Reward(props, id)
    return reward
  }
}
