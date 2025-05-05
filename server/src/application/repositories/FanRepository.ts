import type { Fan } from '../../domain/entities/fan'
import type { FuryCoins } from '../../domain/value-objects/FuryCoins'
import type { Points } from '../../domain/value-objects/Points'
import type { Username } from '../../domain/value-objects/Username'

export interface FanRepository {
  create(fan: Fan): Promise<Fan>
  findById(id: string): Promise<Fan | null>
  findByUsername(username: Username): Promise<Fan | null>
  updatePoints(fan: Fan, points: Points): Promise<Fan>
  updateFuryCoins(fan: Fan, furyCoins: FuryCoins): Promise<Fan>
  getGlobalRanking(): Promise<Fan[] | null>
}
