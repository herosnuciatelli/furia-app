import type { FanRepository } from '../../application/repositories/FanRepository'
import type { Fan } from '../../domain/entities/fan'
import type { FuryCoins } from '../../domain/value-objects/FuryCoins'
import type { Points } from '../../domain/value-objects/Points'
import type { Username } from '../../domain/value-objects/Username'

export class InMemoryFansRepository implements FanRepository {
  private items: Fan[] = []

  async findById(id: string): Promise<Fan | null> {
    const fan = this.items.find(fan => fan.id === id)

    if (!fan) {
      return null
    }

    return fan
  }

  async create(fan: Fan): Promise<Fan> {
    this.items.push(fan)
    return fan
  }

  async findByUsername(username: Username): Promise<Fan | null> {
    const fan = this.items.find(
      fan => fan.props.username.value === username.value
    )

    if (!fan) {
      return null
    }

    return fan
  }

  async updateFuryCoins(fan: Fan, furyCoins: FuryCoins): Promise<Fan> {
    fan.props.furyCoins.update(furyCoins.value)

    const newItems = this.items.map(item => {
      if (item.id === fan.id) {
        return fan
      }

      return item
    })

    this.items = newItems

    return fan
  }

  async updatePoints(fan: Fan, points: Points): Promise<Fan> {
    fan.props.points.update(points.value)

    const newItems = this.items.map(item => {
      if (item.id === fan.id) {
        return fan
      }

      return item
    })

    this.items = newItems

    return fan
  }

  async getGlobalRanking(): Promise<Fan[] | null> {
    this.items.sort((a, b) => a.props.points.value - b.props.points.value)

    return this.items.slice(0, 10)
  }

  async findByUserId(userId: string): Promise<Fan | null> {
    const fan = this.items.find(fan => fan.props.userId === userId)

    if (!fan) return null

    return fan
  }
}
