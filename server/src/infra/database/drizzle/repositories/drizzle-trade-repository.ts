import { eq, gt } from 'drizzle-orm'
import { db } from '..'
import type { TradeRepository } from '../../../../application/repositories/TradeRepository'
import { Trade } from '../../../../domain/entities/trade'
import { trades } from '../schema/schema'

export class DrizzleTradeRepository implements TradeRepository {
  async create(trade: Trade): Promise<Trade> {
    await db.insert(trades).values({
      fanId: trade.props.fanId,
      id: trade.id,
      rewardId: trade.props.rewardId,
      transaction_date: trade.props.transaction_date.toISOString()
    })

    return trade
  }

  async findById(id: string): Promise<Trade | null> {
    const trade = await db.query.trades.findFirst({
      where: eq(trades.id, id),
    })

    if (!trade) return null

    return Trade.create({
      fanId: trade.fanId,
      rewardId: trade.rewardId,
      transaction_date: new Date(trade.transaction_date),
    })
  }

  async history(
    fanId: string,
    cursor?: { start: string }
  ): Promise<Trade[] | null> {
    const tradesQueryResult = await db.query.trades.findMany({
      where: cursor ? gt(trades.id, cursor.start) : eq(trades.fanId, fanId),
      limit: 10,
      orderBy: (trades, { desc }) => [desc(trades.id)],
    })

    if (tradesQueryResult.length === 0) return null

    const tradeHistory: Trade[] = []

    for (const trade of tradesQueryResult) {
      tradeHistory.push(
        Trade.create(
          {
            transaction_date: new Date(trade.transaction_date),
            fanId: trade.fanId,
            rewardId: trade.rewardId,
          },
          trade.id
        )
      )
    }

    return tradeHistory
  }
}
