import type { Reward } from '../../domain/entities/reward'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { RewardRepository } from '../repositories/RewardRepository'

type CreateRewardRequest = {
  reward: Reward
}

export class CreateReward {
  constructor(private rewardRepository: RewardRepository) {}

  async execute({
    reward,
  }: CreateRewardRequest): Promise<ResponseUseCase<Reward>> {
    if (reward.props.quantity.value < 0) {
      return {
        data: [],
        message: 'Reward quantity cannot be negative',
        success: false,
      }
    }

    const rewardWithSameCode = await this.rewardRepository.findByCode(
      reward.props.code
    )

    if (rewardWithSameCode) {
      return {
        data: [rewardWithSameCode],
        message: 'Reward code was already taken.',
        success: false,
      }
    }

    await this.rewardRepository.create(reward)

    return {
      data: [reward],
      message: 'Reward was created with success.',
      success: true,
    }
  }
}
