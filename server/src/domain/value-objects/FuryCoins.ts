import z from 'zod'

export class FuryCoins {
  private furyCoins: number

  private constructor(furyCoins: number) {
    this.validateFuryCoins(furyCoins)
    this.furyCoins = furyCoins
  }

  public static use(furyCoins: number): FuryCoins {
    const coins = new FuryCoins(furyCoins)
    return coins
  }

  private validateFuryCoins(furyCoins: number) {
    const furyCoinsSchema = z
      .number()
      .min(0, 'Fury Coins cannot be less than zero.')
      .max(10_000, 'Fury Coins cannot be more than 10.000')

    const result = furyCoinsSchema.safeParse(furyCoins)

    if (!result.success) {
      throw new Error(result.error.errors[0].message)
    }
  }

  get value(): number {
    return this.furyCoins
  }

  public update(furyCoins: number) {
    if (furyCoins < 0) {
      this.furyCoins = 0
    } else if (furyCoins > 10_000) {
      this.furyCoins = 10_000
    } else {
      this.furyCoins = furyCoins
    }
  }
}
