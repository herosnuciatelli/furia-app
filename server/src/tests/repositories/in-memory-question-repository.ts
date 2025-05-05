import type { QuestionRepository } from '../../application/repositories/QuestionRespository'
import type { Question } from '../../domain/entities/question'

export class InMemoryQuestionRepository implements QuestionRepository {
  private items: Question[] = []

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find(question => question.id === id)

    if (!question) {
      return null
    }

    return question
  }

  async createMany(questions: Question[]): Promise<void> {
    for (const question of questions) {
      this.items.push(question)
    }
  }

  async submitAnswer(id: string, answer: 'a' | 'b' | 'c' | 'd'): Promise<void> {
    const question = await this.findById(id)

    if (question) {
      question.props.submittedAnswer = answer
    }
  }

  async findMany(ids: string[]): Promise<Question[] | null> {
    const questions = this.items.filter(item => ids.includes(item.id))

    if (questions.length === 0) {
      return null
    }

    return questions
  }
}
