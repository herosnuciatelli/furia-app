import { describe, expect, it } from 'vitest'
import { InMemoryFansRepository } from '../../tests/repositories/in-memory-fans-repository'
import { generateFans } from '../../tests/utils/generate-fan'
import { ViewGlobalRanking } from './view-global-ranking'

describe('View global ranking use case', () => {
  it('should allow to view the global ranking', async () => {
    const fanRepository = new InMemoryFansRepository()

    const fans = generateFans()

    for (const fan of fans) {
      fanRepository.create(fan)
    }

    const sut = new ViewGlobalRanking(fanRepository)

    const response = await sut.execute()

    expect(response.success).toEqual(true)
    expect(response.data[0]).length(10)
    expect(response.message).toEqual('The current global ranking was viewed.')
  })

  it('should not allow to view the global ranking without ranked fans', async () => {
    const fanRepository = new InMemoryFansRepository()

    const sut = new ViewGlobalRanking(fanRepository)
    const response = await sut.execute()

    expect(response.success).toEqual(false)
    expect(response.message).toEqual("There's no global ranking yet.")
  })
})
