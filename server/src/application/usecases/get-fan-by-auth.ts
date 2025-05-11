import type { Fan } from '../../domain/entities/fan'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { FanRepository } from '../repositories/FanRepository'

type GetFanByAuthRequest = {
  userId: string
}

export class GetFanByAuth {
  constructor(private fanRepository: FanRepository) {}

  async execute({
    userId,
  }: GetFanByAuthRequest): Promise<ResponseUseCase<Fan>> {
    const fan = await this.fanRepository.findByUserId(userId)

    if (!fan) {
      return {
        data: [],
        message: 'Fan was not found',
        success: false,
      }
    }

    return {
      data: [fan],
      message: 'Fan was found',
      success: true,
    }
  }
}
