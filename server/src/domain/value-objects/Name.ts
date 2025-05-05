import z from 'zod'

export class Name {
  private name: string

  private constructor(name: string) {
    this.validateName(name)

    this.name = name
  }

  public static use(name: string) {
    return new Name(name)
  }

  private validateName(name: string): void {
    const nameSchema = z
      .string()
      .trim()
      .min(3, 'Name must have at least 3 caracters')
      .max(50, 'Name must have at most 50 caracters')

    const result = nameSchema.safeParse(name)

    if (!result.success) {
      throw new Error(result.error.errors[0].message)
    }
  }

  get value(): string {
    return this.name
  }
}
