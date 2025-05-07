import { describe, expect, it } from 'vitest'
import { InMemoryTradeRepository } from '../../tests/repositories/in-memory-trade-repository'
import {
  generateFan,
  generateRewards,
  generateTrades,
} from '../../tests/utils/generate'
import { ViewTradeHistory } from './view-trade-history'

describe('View trade history use case', () => {
  it('should be able to view trade history without cursors', async () => {
    const tradeRepository = new InMemoryTradeRepository()

    const fan = generateFan()
    const rewards = generateRewards()
    const trades = generateTrades(fan, rewards)
    
    for (const trade of trades) {
      tradeRepository.create(trade)
    }

    const sut = new ViewTradeHistory(tradeRepository)
    const result = await sut.execute({ fanId: fan.id })

    expect(result.success).toEqual(true)
    expect(result.data.length).toEqual(10)
  })

  it('should be able to view trade history with cursors', async () => {
    const tradeRepository = new InMemoryTradeRepository()

    const fan = generateFan()
    const rewards = generateRewards()
    const trades = generateTrades(fan, rewards)

    for (const trade of trades) {
      tradeRepository.create(trade)
    }

    const sut = new ViewTradeHistory(tradeRepository)
    const result = await sut.execute({
      fanId: fan.id,
      cursor: { start: trades[5].id },
    })

    expect(result.success).toEqual(true)
    expect(result.data.length).toEqual(10)
  })

  it('should not allow to view trade history without trades', async () => {
    const tradeRepository = new InMemoryTradeRepository()

    const fan = generateFan()

    const sut = new ViewTradeHistory(tradeRepository)
    const result = await sut.execute({ fanId: fan.id })

    expect(result.success).toEqual(false)
    expect(result.data.length).toEqual(0)
    expect(result.message).toEqual("There's no trade history.")
  })
})
