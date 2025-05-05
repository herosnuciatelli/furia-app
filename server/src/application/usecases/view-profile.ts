import type { Fan } from '../../domain/entities/fan'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { FanRepository } from '../repositories/FanRepository'

type ViewProfileRequest = {
  fanId: string
}

export class ViewProfile {
  constructor(private fanRepository: FanRepository) {}

  async execute({ fanId }: ViewProfileRequest): Promise<ResponseUseCase<Fan>> {
    const fan = await this.fanRepository.findById(fanId)

    if (!fan) {
      return {
        data: [],
        message: 'Fan does not exits.',
        success: false,
      }
    }

    return {
      data: [fan],
      message: 'Profile was viewed with success.',
      success: true,
    }
  }
}
