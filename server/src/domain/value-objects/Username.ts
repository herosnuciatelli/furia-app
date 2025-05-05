import z from 'zod'

export class Username {
  private username: string

  private constructor(username: string) {
    this.validateUsername(username)
    this.username = username
  }

  public static use(username: string): Username {
    return new Username(username)
  }

  private validateUsername(username: string) {
    const usernameSchema = z
      .string()
      .min(3, 'Username must have at least 3 caracters')
      .max(20, 'Username must have at most 20 caracters')
      .regex(
        /^[A-Za-z][A-Za-z0-9_]*$/,
        'Username must start with a letter and contain only letters, numbers, and underscores'
      )
      .refine(name => !name.includes('__'), {
        message: 'Username cannot contain consecutive underscores',
      })

    const result = usernameSchema.safeParse(username)

    if (!result.success) {
      throw new Error(result.error.errors[0].message)
    }
  }

  get value(): string {
    return this.username
  }
}
