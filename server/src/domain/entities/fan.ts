import { Entity } from '../../core/domain/Entity'
import type { Email } from '../value-objects/Email'
import type { FuryCoins } from '../value-objects/FuryCoins'
import type { Points } from '../value-objects/Points'
import type { Username } from '../value-objects/Username'

interface FanProps {
  username: Username
  email: Email
  points: Points
  furyCoins: FuryCoins
  userId: string
}

export class Fan extends Entity<FanProps> {
  private constructor(props: FanProps, id?: string) {
    super(props, id)
  }

  public static create(props: FanProps, id?: string) {
    const fan = new Fan(props, id)

    return fan
  }
}
