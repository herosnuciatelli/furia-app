import type { ResponseUseCase } from '../../types/response-usecase'
import type { FanRepository } from '../repositories/FanRepository'
import type { QuestionRepository } from '../repositories/QuestionRespository'
import type { QuizRepository } from '../repositories/QuizRepository'

type TakeQuizRequest = {
  quizId: string
  answers: {
    chosenOption: 'a' | 'b' | 'c' | 'd'
    questionId: string
  }[]
}

export class TakeQuiz {
  constructor(
    private fanRepository: FanRepository,
    private quizRepository: QuizRepository,
    private questionRepository: QuestionRepository
  ) {}

  async execute({
    quizId,
    answers,
  }: TakeQuizRequest): Promise<ResponseUseCase<void>> {
    const quiz = await this.quizRepository.findById(quizId)
    if (!quiz) {
      return {
        success: false,
        message: 'Quiz does not exists',
        data: [],
      }
    }

    const fan = await this.fanRepository.findById(quiz.props.fanId)
    if (!fan) {
      return {
        success: false,
        message: 'Fan does not exists',
        data: [],
      }
    }

    const numberOfQuestionsInQuiz = 5

    if (answers.length !== numberOfQuestionsInQuiz) {
      return {
        success: false,
        message: 'Some question(s) was/were not answered.',
        data: [],
      }
    }

    const questionsAnswered = await this.questionRepository.findMany(
      answers.map(answer => answer.questionId)
    )
    if (!(questionsAnswered?.length === numberOfQuestionsInQuiz)) {
      return {
        success: false,
        message: 'Cannot find all the questions that were answered.',
        data: [],
      }
    }

    /**
     * Submit answers and calculate the score.
     */
    for (const question of questionsAnswered) {
      const answer = answers.find(answer => answer.questionId === question.id)

      if (!answer) {
        return {
          success: false,
          message: 'Question was not answered',
          data: [],
        }
      }

      await this.questionRepository.submitAnswer(
        question.id,
        answer.chosenOption
      )

      if (answer.chosenOption === question.props.correctAnswer) {
        quiz.props.score += 1
      }
    }

    /**
         * See the docs to understand.
         * Score and Furious Coins awarded based on number of correct answers:
                // Correct Answers | Points         | Furious Coins
                // ----------------|----------------|----------------
                // 0               | -160 points    | -50 coins
                // 1               | -130 points    | -40 coins
                // 2               | -100 points    | -30 coins
                // 3               | +80 points     | +10 coins
                // 4               | +100 points    | +25 coins
                // 5               | +120 points    | +30 coins
         */

    await this.quizRepository.updateScore(quiz.id, quiz.props.score)

    switch (quiz.props.score) {
      case 0:
        fan.props.points.update(fan.props.points.value - 160)
        fan.props.furyCoins.update(fan.props.furyCoins.value - 50)
        break
      case 1:
        fan.props.points.update(fan.props.points.value - 130)
        fan.props.furyCoins.update(fan.props.furyCoins.value - 40)
        break
      case 2:
        fan.props.points.update(fan.props.points.value - 100)
        fan.props.furyCoins.update(fan.props.furyCoins.value - 30)
        break
      case 3:
        fan.props.points.update(fan.props.points.value + 80)
        fan.props.furyCoins.update(fan.props.furyCoins.value + 10)
        break
      case 4:
        fan.props.points.update(fan.props.points.value + 100)
        fan.props.furyCoins.update(fan.props.furyCoins.value + 25)
        break
      case 5:
        fan.props.points.update(fan.props.points.value + 120)
        fan.props.furyCoins.update(fan.props.furyCoins.value + 30)
        break
    }

    await this.fanRepository.updateFuryCoins(fan, fan.props.furyCoins)
    await this.fanRepository.updatePoints(fan, fan.props.points)

    return {
      success: true,
      message: 'Quiz was taken',
      data: [],
    }
  }
}
