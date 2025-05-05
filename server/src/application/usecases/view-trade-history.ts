import type { Trade } from '../../domain/entities/trade'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { TradeRepository } from '../repositories/TradeRepository'

type ViewTradeHistoryRequest = {
  fanId: string
  cursor?: { start: string }
}

export class ViewTradeHistory {
  constructor(private tradeRepository: TradeRepository) {}

  async execute({
    fanId,
    cursor,
  }: ViewTradeHistoryRequest): Promise<ResponseUseCase<Trade>> {
    const history = await this.tradeRepository.history(fanId, cursor)
    console.log(cursor)
    if (!history || history.length === 0) {
      return {
        success: false,
        message: "There's no trade history.",
        data: [],
      }
    }

    if (history.length > 10) {
      return {
        success: false,
        message: 'The history query limit is 10 quizzes at a time.',
        data: history,
      }
    }

    return {
      success: true,
      message: 'Trade history was viewed with success.',
      data: history,
    }
  }
}
