import type { Quiz } from '../../domain/entities/quiz'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { QuizRepository } from '../repositories/QuizRepository'

type ViewQuizHistoryRequest = {
  fanId: string
  cursor?: { start: string }
}

export class ViewQuizHistory {
  constructor(private quizRepository: QuizRepository) {}

  async execute({
    fanId,
    cursor,
  }: ViewQuizHistoryRequest): Promise<ResponseUseCase<Quiz>> {
    const history = await this.quizRepository.history(fanId, cursor)

    if (!history || history.length === 0) {
      return {
        success: false,
        message: "There's no quiz history.",
        data: [],
      }
    }

    if (history.length > 10) {
      return {
        success: false,
        message: 'The history query limit is 10 quizzes at a time.',
        data: history,
      }
    }

    return {
      success: true,
      message: 'Quiz history was viewed with success.',
      data: history,
    }
  }
}
