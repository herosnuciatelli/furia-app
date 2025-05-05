import type { Fan } from '../../domain/entities/fan'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { FanRepository } from '../repositories/FanRepository'

export class ViewGlobalRanking {
  constructor(private fanRepository: FanRepository) {}

  async execute(): Promise<ResponseUseCase<Fan[]>> {
    const rankedFans = await this.fanRepository.getGlobalRanking()

    if (!rankedFans) {
      return {
        data: [],
        message: 'It was not possible to view the global ranking',
        success: false,
      }
    }

    if (rankedFans.length === 0) {
      return {
        data: [],
        message: "There's no global ranking yet.",
        success: false,
      }
    }

    if (rankedFans.length > 10) {
      return {
        success: false,
        message: 'The global ranking query limit is 10 fans.',
        data: [rankedFans],
      }
    }

    return {
      data: [rankedFans],
      success: true,
      message: 'The current global ranking was viewed.',
    }
  }
}
