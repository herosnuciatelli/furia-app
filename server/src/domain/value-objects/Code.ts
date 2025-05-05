import z from 'zod'

export class Code {
  private code: string

  private constructor(code: string) {
    this.validateCode(code)

    this.code = code
  }

  public static use(code: string): Code {
    return new Code(code)
  }

  private validateCode(code: string): void {
    const codeSchema = z
      .string()
      .trim()
      .min(5, 'Code must have at least 5 caracters')
      .max(20, 'Code must have at most 20 caracters')

    const result = codeSchema.safeParse(code)

    if (!result.success) {
      throw new Error(result.error.errors[0].message)
    }
  }

  get value(): string {
    return this.code
  }
}
