import { Reward } from '../../domain/entities/reward'
import { Code } from '../../domain/value-objects/Code'
import { FuryCoins } from '../../domain/value-objects/FuryCoins'
import { Name } from '../../domain/value-objects/Name'
import { Quantity } from '../../domain/value-objects/Quantity'

export function generateReward(code: string) {
  const rewardCreated = Reward.create({
    code: Code.use(code),
    name: Name.use('Cupom de desconto 20%'),
    quantity: Quantity.use(10),
    price: FuryCoins.use(100),
  })
  return rewardCreated
}

export function generateRewards() {
  const rewards: Reward[] = []
  for (let i = 0; i < 30; i++) {
    rewards.push(generateReward(`PROMO-${i}`))
  }
  return rewards
}
