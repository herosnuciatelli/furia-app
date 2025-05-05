import z from 'zod'

export class Points {
  private points: number

  private constructor(points: number) {
    this.validatePoints(points)
    this.points = points
  }

  public static use(points: number): Points {
    const point = new Points(points)
    return point
  }

  private validatePoints(points: number) {
    const pointsSchema = z.number().min(0, 'Points cannot be less than zero.')

    const result = pointsSchema.safeParse(points)

    if (!result.success) {
      throw new Error(result.error.errors[0].message)
    }
  }

  get value(): number {
    return this.points
  }

  public update(points: number) {
    if (points < 0) {
      this.points = 0
    } else {
      this.points = points
    }
  }
}
