import { describe, expect, it } from 'vitest'
import { InMemoryFansRepository } from '../../tests/repositories/in-memory-fans-repository'
import { InMemoryRewardRepository } from '../../tests/repositories/in-memory-reward-repository'
import { InMemoryTradeRepository } from '../../tests/repositories/in-memory-trade-repository'
import { PurchaseReward } from './purchase-reward'

import { Trade } from '../../domain/entities/trade'
// generators
import { generateFan, generateReward } from '../../tests/utils/generate'

describe('Purchase reward use case', () => {
  it('should allow to purchase a reward', async () => {
    const fanRepository = new InMemoryFansRepository()
    const rewardRepository = new InMemoryRewardRepository()
    const tradeRepository = new InMemoryTradeRepository()

    const fan = generateFan()
    const reward = generateReward('PROMO20')

    fan.props.furyCoins.update(1_000)
    reward.props.price.update(1_000)
    reward.props.quantity.update(10)

    await fanRepository.create(fan)
    await rewardRepository.create(reward)

    const sut = new PurchaseReward(
      fanRepository,
      rewardRepository,
      tradeRepository
    )

    const response = await sut.execute({
      fanId: fan.id,
      rewardCode: reward.props.code,
    })

    const tradeRepositoryItem = await tradeRepository.findById(
      response.data[0].id
    )

    expect(response.success).toBeTruthy()
    expect(response.message).toEqual('Purchase was made successfully.')

    expect(reward.props.quantity.value).toEqual(9)
    expect(fan.props.furyCoins.value).toEqual(0)

    expect(response.data[0]).toBeInstanceOf(Trade)
    expect(response.data[0].props.fanId).toEqual(fan.id)
    expect(response.data[0].props.rewardId).toEqual(reward.id)
    expect(tradeRepositoryItem?.id).toBeDefined()
  })

  it('should not allow to purchase a reward out of stock', async () => {
    const fanRepository = new InMemoryFansRepository()
    const rewardRepository = new InMemoryRewardRepository()
    const tradeRepository = new InMemoryTradeRepository()

    const fan = generateFan()
    const reward = generateReward('PROMO20')

    fan.props.furyCoins.update(1_000)
    reward.props.price.update(1_000)
    reward.props.quantity.update(0)

    await fanRepository.create(fan)
    await rewardRepository.create(reward)

    const sut = new PurchaseReward(
      fanRepository,
      rewardRepository,
      tradeRepository
    )

    const response = await sut.execute({
      fanId: fan.id,
      rewardCode: reward.props.code,
    })

    expect(response.success).toBeFalsy()
    expect(response.message).toEqual('Reward out of stock')

    expect(reward.props.quantity.value).toEqual(0)
    expect(fan.props.furyCoins.value).toEqual(1_000)
  })

  it('should not allow to purchase a reward if the fan does not exists', async () => {
    const fanRepository = new InMemoryFansRepository()
    const rewardRepository = new InMemoryRewardRepository()
    const tradeRepository = new InMemoryTradeRepository()

    const fan = generateFan()
    const reward = generateReward('PROMO20')

    fan.props.furyCoins.update(1_000)
    reward.props.price.update(1_000)
    reward.props.quantity.update(10)

    await rewardRepository.create(reward)

    const sut = new PurchaseReward(
      fanRepository,
      rewardRepository,
      tradeRepository
    )

    const response = await sut.execute({
      fanId: fan.id,
      rewardCode: reward.props.code,
    })

    expect(response.success).toBeFalsy()
    expect(response.message).toEqual('Fan does not exits.')
  })

  it('should not allow to purchase a reward if the reward does not exists', async () => {
    const fanRepository = new InMemoryFansRepository()
    const rewardRepository = new InMemoryRewardRepository()
    const tradeRepository = new InMemoryTradeRepository()

    const fan = generateFan()
    const reward = generateReward('PROMO20')

    fan.props.furyCoins.update(1_000)
    reward.props.price.update(1_000)
    reward.props.quantity.update(10)

    await fanRepository.create(fan)

    const sut = new PurchaseReward(
      fanRepository,
      rewardRepository,
      tradeRepository
    )

    const response = await sut.execute({
      fanId: fan.id,
      rewardCode: reward.props.code,
    })

    expect(response.success).toBeFalsy()
    expect(response.message).toEqual('Reward does not exits.')
  })

  it('should not allow to purchase a reward if the fan does not have enough coins', async () => {
    const fanRepository = new InMemoryFansRepository()
    const rewardRepository = new InMemoryRewardRepository()
    const tradeRepository = new InMemoryTradeRepository()

    const fan = generateFan()
    const reward = generateReward('PROMO20')

    fan.props.furyCoins.update(1_000)
    reward.props.price.update(1_100)
    reward.props.quantity.update(10)

    await fanRepository.create(fan)
    await rewardRepository.create(reward)

    const sut = new PurchaseReward(
      fanRepository,
      rewardRepository,
      tradeRepository
    )

    const response = await sut.execute({
      fanId: fan.id,
      rewardCode: reward.props.code,
    })

    expect(response.success).toBeFalsy()
    expect(response.message).toEqual('Fan does not have enough fury coins.')
  })
})
