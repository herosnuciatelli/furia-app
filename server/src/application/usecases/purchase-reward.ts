import { Trade } from '../../domain/entities/trade'
import type { Code } from '../../domain/value-objects/Code'
import { FuryCoins } from '../../domain/value-objects/FuryCoins'
import { Quantity } from '../../domain/value-objects/Quantity'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { FanRepository } from '../repositories/FanRepository'
import type { RewardRepository } from '../repositories/RewardRepository'
import type { TradeRepository } from '../repositories/TradeRepository'

type PurchaseRewardRequest = {
  fanId: string
  rewardCode: Code
}

export class PurchaseReward {
  constructor(
    private fanRepository: FanRepository,
    private rewardRepository: RewardRepository,
    private tradeRepository: TradeRepository
  ) {}

  async execute({
    fanId,
    rewardCode,
  }: PurchaseRewardRequest): Promise<ResponseUseCase<Trade>> {
    let fan = await this.fanRepository.findById(fanId)
    const reward = await this.rewardRepository.findByCode(rewardCode)

    if (!fan) {
      return {
        data: [],
        message: 'Fan does not exits.',
        success: false,
      }
    }

    if (!reward) {
      return {
        data: [],
        message: 'Reward does not exits.',
        success: false,
      }
    }

    if (fan.props.furyCoins.value < reward.props.price.value) {
      return {
        data: [],
        message: 'Fan does not have enough fury coins.',
        success: false,
      }
    }

    if (reward.props.quantity.value < 1) {
      return {
        data: [],
        message: 'Reward out of stock',
        success: false,
      }
    }

    const newBalance = fan.props.furyCoins.value - reward.props.price.value
    fan = await this.fanRepository.updateFuryCoins(
      fan,
      FuryCoins.use(newBalance)
    )

    /**
     * @description -1 means that once a reward is purchased, its quantity will be decreased by one.
     */
    await this.rewardRepository.updateQuantity(
      reward.id,
      Quantity.use(reward.props.quantity.value - 1)
    )

    let trade = Trade.create({
      fanId: fan.id,
      rewardId: reward.id,
      transaction_date: new Date(),
    })

    trade = await this.tradeRepository.create(trade)

    return {
      success: true,
      message: 'Purchase was made successfully.',
      data: [trade],
    }
  }
}
