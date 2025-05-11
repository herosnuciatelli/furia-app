import { eq } from 'drizzle-orm'
import { db } from '..'
import type { FanRepository } from '../../../../application/repositories/FanRepository'
import { Fan } from '../../../../domain/entities/fan'
import { Email } from '../../../../domain/value-objects/Email'
import { FuryCoins } from '../../../../domain/value-objects/FuryCoins'
import { Points } from '../../../../domain/value-objects/Points'
import { Username } from '../../../../domain/value-objects/Username'

import { users } from '../schema/schema'

function createFan(
  fan:
    | {
        role: 'FAN' | 'ADMIN'
        id: string
        username: string
        userId: string
        email: string
        points: number
        furyCoins: number
      }
    | undefined
): Fan | null {
  if (!fan) return null

  const fanCreated = Fan.create(
    {
      email: Email.use(fan.email),
      furyCoins: FuryCoins.use(fan.furyCoins),
      points: Points.use(fan.points),
      userId: fan.userId,
      username: Username.use(fan.username),
    },
    fan.id
  )

  return fanCreated
}

export class DrizzleFanRepository implements FanRepository {
  async create(fan: Fan): Promise<Fan> {
    await db
      .insert(users)
      .values({
        email: fan.props.email.value,
        id: fan.id,
        userId: fan.props.userId,
        username: fan.props.username.value,
        furyCoins: fan.props.furyCoins.value,
        points: fan.props.points.value,
        role: 'FAN',
      })
      .returning()

    return fan
  }

  async findById(id: string): Promise<Fan | null> {
    const fan = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    const fanCreated = createFan(fan)

    if (!fanCreated) return null

    return fanCreated
  }

  async findByUsername(username: Username): Promise<Fan | null> {
    const fan = await db.query.users.findFirst({
      where: eq(users.username, username.value),
    })

    const fanCreated = createFan(fan)

    if (!fanCreated) return null

    return fanCreated
  }

  async getGlobalRanking(): Promise<Fan[] | null> {
    const ranking = await db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.points)],
      limit: 10,
    })

    if (ranking.length === 0) return null

    const rankedFans: Fan[] = []

    for (const fan of ranking) {
      rankedFans.push(
        Fan.create(
          {
            email: Email.use(fan.email),
            furyCoins: FuryCoins.use(fan.furyCoins),
            points: Points.use(fan.points),
            userId: fan.userId,
            username: Username.use(fan.username),
          },
          fan.id
        )
      )
    }

    return rankedFans
  }

  async updateFuryCoins(fan: Fan, furyCoins: FuryCoins): Promise<Fan> {
    const fanUpdatedReturning = await db
      .update(users)
      .set({
        furyCoins: furyCoins.value,
      })
      .where(eq(users.id, fan.id))
      .returning()

    const fanUpdated = fanUpdatedReturning[0]

    return Fan.create(
      {
        email: Email.use(fanUpdated.email),
        furyCoins: FuryCoins.use(fanUpdated.furyCoins),
        points: Points.use(fanUpdated.points),
        userId: fanUpdated.userId,
        username: Username.use(fanUpdated.username),
      },
      fanUpdated.id
    )
  }

  async updatePoints(fan: Fan, points: Points): Promise<Fan> {
    const fanUpdatedReturning = await db
      .update(users)
      .set({
        points: points.value,
      })
      .where(eq(users.id, fan.id))
      .returning()

    const fanUpdated = fanUpdatedReturning[0]

    return Fan.create(
      {
        email: Email.use(fanUpdated.email),
        furyCoins: FuryCoins.use(fanUpdated.furyCoins),
        points: Points.use(fanUpdated.points),
        userId: fanUpdated.userId,
        username: Username.use(fanUpdated.username),
      },
      fanUpdated.id
    )
  }

  async findByUserId(userId: string): Promise<Fan | null> {
    const fan = await db.query.users.findFirst({
      where: eq(users.userId, userId),
    })

    if (!fan) return null

    if (fan.role !== 'FAN') return null

    return Fan.create(
      {
        email: Email.use(fan.email),
        furyCoins: FuryCoins.use(fan.furyCoins),
        points: Points.use(fan.points),
        userId: fan.userId,
        username: Username.use(fan.username),
      },
      fan.id
    )
  }
}
