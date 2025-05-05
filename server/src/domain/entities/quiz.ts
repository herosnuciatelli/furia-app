import { Entity } from '../../core/domain/Entity'

interface QuizProps {
  title: string
  questionsIdentifiers: string[]
  fanId: string
  score: number
  created_at: Date
}

export class Quiz extends Entity<QuizProps> {
  private constructor(props: QuizProps, id?: string) {
    super(props, id)
  }

  public static create(props: QuizProps, id?: string): Quiz {
    const quiz = new Quiz(props, id)
    return quiz
  }
}
