import { describe, expect, it } from 'vitest'
import { InMemoryFansRepository } from '../../tests/repositories/in-memory-fans-repository'
import { generateFan } from '../../tests/utils/generate'
import { ViewProfile } from './view-profile'

describe('View profile use case', () => {
  it('should allow to view the fan profile', async () => {
    const fanRepository = new InMemoryFansRepository()
    const fan = generateFan()

    await fanRepository.create(fan)

    const sut = new ViewProfile(fanRepository)
    const response = await sut.execute({ fanId: fan.id })

    expect(response.success).toEqual(true)
    expect(response.data[0]).toEqual(fan)
    expect(response.message).toEqual('Profile was viewed with success.')
  })

  it('should not allow to view the fan profile that does not exits.', async () => {
    const fanRepository = new InMemoryFansRepository()
    const fan = generateFan()

    const sut = new ViewProfile(fanRepository)
    const response = await sut.execute({ fanId: fan.id })

    expect(response.success).toEqual(false)
    expect(response.message).toEqual('Fan does not exits.')
  })
})
