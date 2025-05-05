import { Fan } from '../../domain/entities/fan'
import type { Email } from '../../domain/value-objects/Email'
import { FuryCoins } from '../../domain/value-objects/FuryCoins'
import { Points } from '../../domain/value-objects/Points'
import type { Username } from '../../domain/value-objects/Username'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { FanRepository } from '../repositories/FanRepository'

type CreateFanRequest = {
  username: Username
  email: Email
  userId: string
}

export class CreateFan {
  constructor(private fanRepository: FanRepository) {}

  async execute({
    email,
    username,
    userId,
  }: CreateFanRequest): Promise<ResponseUseCase<Fan>> {
    const fanWithSameUsername =
      await this.fanRepository.findByUsername(username)

    if (fanWithSameUsername) {
      return {
        message: 'This username was already taken.',
        success: false,
        data: [],
      }
    }

    const fan = Fan.create({
      email,
      username,
      furyCoins: FuryCoins.use(0),
      points: Points.use(0),
      userId,
    })

    const fanCreated = await this.fanRepository.create(fan)

    if (!fanCreated) {
      return {
        message: 'Fan was not created.',
        success: false,
        data: [],
      }
    }

    return {
      message: 'Fan was created.',
      success: true,
      data: [fan],
    }
  }
}
