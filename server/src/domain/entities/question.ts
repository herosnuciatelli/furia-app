import { Entity } from '../../core/domain/Entity'

interface QuestionProps {
  statement: string
  options: { id: 'a' | 'b' | 'c' | 'd'; option: string }[]
  correctAnswer: 'a' | 'b' | 'c' | 'd'
  submittedAnswer: 'a' | 'b' | 'c' | 'd' | ''
}

export class Question extends Entity<QuestionProps> {
  private constructor(props: QuestionProps, id?: string) {
    super(props, id)
  }

  public static create(props: QuestionProps, id?: string): Question {
    const question = new Question(props, id)
    return question
  }
}
