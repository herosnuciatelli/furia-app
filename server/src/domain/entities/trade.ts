import { Entity } from '../../core/domain/Entity'

interface TradeProps {
  rewardId: string // identifier
  fanId: string // identifier
  transaction_date: Date
}

export class Trade extends Entity<TradeProps> {
  private constructor(props: TradeProps, id?: string) {
    super(props, id)
  }

  public static create(props: TradeProps, id?: string): Trade {
    const trade = new Trade(props, id)
    return trade
  }
}
