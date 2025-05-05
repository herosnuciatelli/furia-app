import type { Fan } from '../../domain/entities/fan'
import type { Reward } from '../../domain/entities/reward'
import { Trade } from '../../domain/entities/trade'

function generateTrades(fan: Fan, rewards: Reward[]) {
  const trades = [] as Trade[]

  for (let i = 0; i < 30; i++) {
    const tradeCreated = Trade.create({
      transaction_date: new Date(),
      fanId: fan.id,
      rewardId: rewards[i].id,
    })

    trades.push(tradeCreated)
  }

  return trades
}

export { generateTrades }
