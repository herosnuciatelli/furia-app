import { decodeTime } from 'ulid'
import type { TradeRepository } from '../../application/repositories/TradeRepository'
import type { Trade } from '../../domain/entities/trade'

export class InMemoryTradeRepository implements TradeRepository {
  private items: Trade[] = []

  async create(trade: Trade): Promise<Trade> {
    this.items.push(trade)
    return trade
  }

  async findById(id: string): Promise<Trade | null> {
    const trade = this.items.find(trade => trade.id === id)
    if (!trade) return null

    return trade
  }

  async history(
    fanId: string,
    cursor?: { start: string }
  ): Promise<Trade[] | null> {
    let history = this.items.filter(item => item.props.fanId === fanId)

    if (history.length === 0) {
      return null
    }

    if (!cursor) {
      history = history.slice(0, 10)
      return history
    }
    /**
     * @param end The query limit is 10 quizzes at time.
     */

    const cursorStart = decodeTime(cursor.start)

    history.filter(quiz => {
      const quizDate = decodeTime(quiz.id)
      if (quizDate > cursorStart) return quiz
    })

    history = history.slice(0, 10)

    return history
  }
}
