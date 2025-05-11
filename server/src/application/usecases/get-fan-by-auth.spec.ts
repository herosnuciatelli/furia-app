import { describe, expect, it } from 'vitest'
import { Fan } from '../../domain/entities/fan'
import { Email } from '../../domain/value-objects/Email'
import { FuryCoins } from '../../domain/value-objects/FuryCoins'
import { Points } from '../../domain/value-objects/Points'
import { Username } from '../../domain/value-objects/Username'
import { InMemoryFansRepository } from '../../tests/repositories/in-memory-fans-repository'
import { generateFans } from '../../tests/utils/generate'
import { GetFanByAuth } from './get-fan-by-auth'

describe('Get fan by auth use case', () => {
  it('should be able to get the fan', async () => {
    const fanRepository = new InMemoryFansRepository()
    const fans = generateFans()

    for (const fan of fans) {
      await fanRepository.create(fan)
    }

    const fan = Fan.create({
      email: Email.use('heros@gmail.com'),
      furyCoins: FuryCoins.use(0),
      points: Points.use(0),
      userId: 'heros-id',
      username: Username.use('heros'),
    })

    await fanRepository.create(fan)

    const getFanByAuth = new GetFanByAuth(fanRepository)

    const response = await getFanByAuth.execute({
      userId: fan.props.userId,
    })

    expect(response.success).toBeTruthy()
    expect(response.data[0].props.userId).toEqual(fan.props.userId)
  })

  it('should not be able to get the fan that does not exists', async () => {
    const fanRepository = new InMemoryFansRepository()
    const fans = generateFans()

    for (const fan of fans) {
      await fanRepository.create(fan)
    }

    const fan = Fan.create({
      email: Email.use('heros@gmail.com'),
      furyCoins: FuryCoins.use(0),
      points: Points.use(0),
      userId: 'heros-id',
      username: Username.use('heros'),
    })

    const getFanByAuth = new GetFanByAuth(fanRepository)

    const response = await getFanByAuth.execute({
      userId: fan.props.userId,
    })

    expect(response.success).toBeFalsy()
    expect(response.data.length).toEqual(0)
  })
})
