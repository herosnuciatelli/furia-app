import z from 'zod'

export class Quantity {
  private quantity: number

  private constructor(quantity: number) {
    this.validateQuantity(quantity)
    this.quantity = quantity
  }

  public static use(quantity: number): Quantity {
    const quantityUsed = new Quantity(quantity)
    return quantityUsed
  }

  private validateQuantity(quantity: number) {
    const quantitySchema = z
      .number()
      .min(0, 'Quantity cannot be less than zero.')
      .max(100_000, 'Quantity cannot be more than 100.000')

    const result = quantitySchema.safeParse(quantity)

    if (!result.success) {
      throw new Error(result.error.errors[0].message)
    }
  }

  get value(): number {
    return this.quantity
  }

  public update(quantity: number) {
    if (quantity < 0) {
      this.quantity = 0
    } else if (quantity > 100_000) {
      this.quantity = 100_000
    } else {
      this.quantity = quantity
    }
  }
}
