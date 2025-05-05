import { describe, expect, it } from 'vitest'
import { InMemoryRewardRepository } from '../../tests/repositories/in-memory-reward-repository'
import { generateReward } from '../../tests/utils/generate'
import { CreateReward } from './create-reward'

describe('Create reward use case', () => {
  it('should allow to create a reward', async () => {
    const rewardRepository = new InMemoryRewardRepository()

    const reward = generateReward('PROMO20')

    const sut = new CreateReward(rewardRepository)
    const response = await sut.execute({ reward })

    expect(response.success).toBeTruthy()
    expect(response.message).toEqual('Reward was created with success.')
    expect(response.data[0].id).toEqual(reward.id)
  })

  it('should not allow to create a reward with same code than other', async () => {
    const rewardRepository = new InMemoryRewardRepository()

    const reward = generateReward('PROMO20')

    await rewardRepository.create(generateReward('PROMO20'))

    const sut = new CreateReward(rewardRepository)
    const response = await sut.execute({ reward })

    expect(response.success).toBeFalsy()
    expect(response.message).toEqual('Reward code was already taken.')
  })
})
