import { Quiz } from '../../domain/entities/quiz'
import type { ResponseUseCase } from '../../types/response-usecase'
import type { ChatbotRepository } from '../repositories/ChatbotRepository'
import type { QuestionRepository } from '../repositories/QuestionRespository'
import type { QuizRepository } from '../repositories/QuizRepository'

type CreateQuizRequest = {
  fanId: string
}

export class CreateQuiz {
  constructor(
    private QuestionRepository: QuestionRepository,
    private QuizRepository: QuizRepository,
    private ChatbotRepository: ChatbotRepository
  ) {}

  async execute({ fanId }: CreateQuizRequest): Promise<ResponseUseCase<Quiz>> {
    let { questions, title } = await this.ChatbotRepository.generateQuiz()

    if (questions.length < 5) {
      return {
        success: false,
        data: [],
        message: 'To created a quiz, it needs at least 5 questions',
      }
    }

    if (title.length > 50) {
      return {
        success: false,
        data: [],
        message: 'To created a quiz, the title must have at most 50 caracters',
      }
    }

    questions = questions.slice(0, 5)

    await this.QuestionRepository.createMany(questions)

    const quiz = Quiz.create({
      fanId,
      questionsIdentifiers: questions.map(question => question.id),
      score: 0,
      title,
      created_at: new Date(),
    })

    const createdQuiz = await this.QuizRepository.create(quiz)

    return {
      success: true,
      message: 'Quiz was created.',
      data: [createdQuiz],
    }
  }
}
