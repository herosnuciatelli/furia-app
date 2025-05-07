import { describe, expect, it } from 'vitest'
import { Fan } from '../../domain/entities/fan'
import { Email } from '../../domain/value-objects/Email'
import { FuryCoins } from '../../domain/value-objects/FuryCoins'
import { Points } from '../../domain/value-objects/Points'
import { Username } from '../../domain/value-objects/Username'
import { InMemoryFansRepository } from '../../tests/repositories/in-memory-fans-repository'
import { CreateFan } from './create-fan'

describe('Create fan use case', () => {
  it('should be able to create a fan', async () => {
    const fanRepository = new InMemoryFansRepository()

    const systemUnderTest = new CreateFan(fanRepository)

    const email = Email.use('heros@gmail.com')
    const username = Username.use('heros_nuciatelli')

    const response = await systemUnderTest.execute({
      email,
      username,
      userId: ""
    })

    expect(response.data[0]).toBeInstanceOf(Fan)
  })

  it('should not allow creating a fan with a username shorter than 3 characters', async () => {
    const fanRepository = new InMemoryFansRepository()

    const systemUnderTest = new CreateFan(fanRepository)

    expect(() => {
      const email = Email.use('heros@gmail.com')
      const username = Username.use('he')

      const response = systemUnderTest.execute({
        email,
        username,
        userId: ""
      })
      return response
    }).toThrow()
  })

  it('should not allow creating a fan with a username bigger than 20 characters', async () => {
    const fanRepository = new InMemoryFansRepository()

    const systemUnderTest = new CreateFan(fanRepository)

    expect(() => {
      const email = Email.use('heros@gmail.com')
      const username = Username.use('ThisUsernameHasMoreThan20CaractersForSure')

      const response = systemUnderTest.execute({
        email,
        username,
        userId: ""
      })
      return response
    }).toThrow()
  })

  it('should fail if username contains consecutive underscores', () => {
    const fanRepository = new InMemoryFansRepository()

    const systemUnderTest = new CreateFan(fanRepository)

    expect(() => {
      const email = Email.use('heros@gmail.com')
      const username = Username.use('ThisUsernameHasMoreThan20CaractersForSure')

      const response = systemUnderTest.execute({
        email,
        username,
        userId: ""
      })
      return response
    }).toThrow()
  })

  it("should not allow creating a fan with a username that doesn't start with a letter or contains invalid characters", () => {
    const fanRepository = new InMemoryFansRepository()

    const systemUnderTest = new CreateFan(fanRepository)

    expect(() => {
      const email = Email.use('heros@gmail.com')
      const username = Username.use('7heros7')

      const response = systemUnderTest.execute({
        email,
        username,
        userId: ""
      })
      return response
    }).toThrow()

    expect(() => {
      const email = Email.use('heros@gmail.com')
      const username = Username.use('heros.nuciatelli')

      const response = systemUnderTest.execute({
        email,
        username,
        userId: ""
      })
      return response
    }).toThrow()
  })

  it('should not allow create a fan with a username already taken.', async () => {
    const fanRepository = new InMemoryFansRepository()

    const fan = Fan.create({
      email: Email.use('heros@gmail.com'),
      furyCoins: FuryCoins.use(0),
      points: Points.use(0),
      username: Username.use('heros_nuciatelli'),
      userId: '',
    })

    fanRepository.create(fan)

    const systemUnderTest = new CreateFan(fanRepository)

    const response = await systemUnderTest.execute({
      email: Email.use('heros7@gmail.com'),
      username: Username.use('heros_nuciatelli'),
      userId: ""
    })

    expect(response.success).toEqual(false)
  })
})
