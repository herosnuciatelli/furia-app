import { Fan } from '../../domain/entities/fan'
import { Email } from '../../domain/value-objects/Email'
import { FuryCoins } from '../../domain/value-objects/FuryCoins'
import { Points } from '../../domain/value-objects/Points'
import { Username } from '../../domain/value-objects/Username'

function generateFan() {
  return Fan.create({
    email: Email.use('heros@gmail.com'),
    furyCoins: FuryCoins.use(50),
    points: Points.use(200),
    username: Username.use('heros_nuciatelli'),
    userId: '',
  })
}

function generateFans() {
  const fans = [] as Fan[]

  for (let i = 0; i < 30; i++) {
    const fan = Fan.create({
      email: Email.use('heros@gmail.com'),
      furyCoins: FuryCoins.use(50),
      points: Points.use(200),
      username: Username.use('heros_nuciatelli'),
      userId: '',
    })

    fans.push(fan)
  }

  return fans
}

export { generateFan, generateFans }
