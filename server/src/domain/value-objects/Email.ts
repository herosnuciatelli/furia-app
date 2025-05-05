import z from 'zod'

export class Email {
  private email: string

  private constructor(email: string) {
    this.validateEmail(email)
    this.email = email
  }

  public static use(email: string): Email {
    const coins = new Email(email)
    return coins
  }

  private validateEmail(email: string) {
    const emailSchema = z.string().email()

    const result = emailSchema.safeParse(email)

    if (!result.success) {
      throw new Error(result.error.errors[0].message)
    }
  }

  get value(): string {
    return this.email
  }
}
