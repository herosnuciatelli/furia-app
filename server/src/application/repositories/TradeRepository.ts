import type { Trade } from '../../domain/entities/trade'

export interface TradeRepository {
  create(trade: Trade): Promise<Trade>
  findById(id: string): Promise<Trade | null>
  history(fanId: string, cursor?: { start: string }): Promise<Trade[] | null>
}
