import { describe, expect, it } from 'vitest'
import { FuryCoins } from '../../domain/value-objects/FuryCoins'
import { Points } from '../../domain/value-objects/Points'
import { InMemoryFansRepository } from '../../tests/repositories/in-memory-fans-repository'
import { InMemoryQuestionRepository } from '../../tests/repositories/in-memory-question-repository'
import { InMemoryQuizRepository } from '../../tests/repositories/in-memory-quiz-respository'
import {
  generateFan,
  generateQuestions,
  generateQuiz,
} from '../../tests/utils/generate'
import { TakeQuiz } from './take-quiz'

describe('Take quiz use case', () => {
  it('should be able to take a quiz', async () => {
    const fanRepository = new InMemoryFansRepository()
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quiz = generateQuiz(fan, questions)

    fanRepository.create(fan)
    questionRepository.createMany(questions)
    quizRepository.create(quiz)

    const answers = [] as {
      chosenOption: 'a' | 'b' | 'c' | 'd'
      questionId: string
    }[]

    for (let i = 0; i < 5; i++) {
      answers.push({
        chosenOption: 'a',
        questionId: questions[i].id,
      })
    }

    const systemUnderTest = new TakeQuiz(
      fanRepository,
      quizRepository,
      questionRepository
    )
    await systemUnderTest.execute({ quizId: quiz.id, answers })

    expect(quiz.props.score).toEqual(4)
    expect(questions[0].props.submittedAnswer).toEqual('a')
    expect(fan.props.furyCoins.value).toEqual(75)
    expect(fan.props.points.value).toEqual(300)
  })

  it('should deduct FuryCoins and points from the fan', async () => {
    const fanRepository = new InMemoryFansRepository()
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quiz = generateQuiz(fan, questions)

    fanRepository.create(fan)
    questionRepository.createMany(questions)
    quizRepository.create(quiz)

    const answers = [] as {
      chosenOption: 'a' | 'b' | 'c' | 'd'
      questionId: string
    }[]

    for (let i = 0; i < 5; i++) {
      answers.push({
        chosenOption: 'b',
        questionId: questions[i].id,
      })
    }

    /**
     * @description Reset to 0 points and 0 fury coins to see if become 0
     */
    fanRepository.updateFuryCoins(fan, FuryCoins.use(0))
    fanRepository.updatePoints(fan, Points.use(0))

    const systemUnderTest = new TakeQuiz(
      fanRepository,
      quizRepository,
      questionRepository
    )
    await systemUnderTest.execute({ quizId: quiz.id, answers })

    expect(quiz.props.score).toEqual(1)
    expect(questions[0].props.submittedAnswer).toEqual('b')
    expect(fan.props.furyCoins.value).toEqual(0)
    expect(fan.props.points.value).toEqual(0)
  })

  it('should not allow take a quiz who does not exits', async () => {
    const fanRepository = new InMemoryFansRepository()
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quiz = generateQuiz(fan, questions)

    fanRepository.create(fan)
    questionRepository.createMany(questions)

    const answers = [] as {
      chosenOption: 'a' | 'b' | 'c' | 'd'
      questionId: string
    }[]

    for (let i = 0; i < 5; i++) {
      answers.push({
        chosenOption: 'a',
        questionId: questions[i].id,
      })
    }

    const systemUnderTest = new TakeQuiz(
      fanRepository,
      quizRepository,
      questionRepository
    )
    const response = await systemUnderTest.execute({ quizId: quiz.id, answers })

    expect(response.success).toEqual(false)
    expect(response.message).toEqual('Quiz does not exists')
  })

  it('should not allow take a quiz who fan does not exits', async () => {
    const fanRepository = new InMemoryFansRepository()
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quiz = generateQuiz(fan, questions)

    questionRepository.createMany(questions)
    quizRepository.create(quiz)

    const answers = [] as {
      chosenOption: 'a' | 'b' | 'c' | 'd'
      questionId: string
    }[]

    for (let i = 0; i < 5; i++) {
      answers.push({
        chosenOption: 'a',
        questionId: questions[i].id,
      })
    }

    const systemUnderTest = new TakeQuiz(
      fanRepository,
      quizRepository,
      questionRepository
    )
    const response = await systemUnderTest.execute({ quizId: quiz.id, answers })

    expect(response.success).toEqual(false)
    expect(response.message).toEqual('Fan does not exists')
  })

  it('should not allow take a quiz with questions missing', async () => {
    const fanRepository = new InMemoryFansRepository()
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quiz = generateQuiz(fan, questions)

    questionRepository.createMany(
      questions.filter(question => question.id !== questions[0].id)
    ) // It'll create only 4 questions
    quizRepository.create(quiz)
    fanRepository.create(fan)

    const answers = [] as {
      chosenOption: 'a' | 'b' | 'c' | 'd'
      questionId: string
    }[]

    for (let i = 0; i < 5; i++) {
      answers.push({
        chosenOption: 'a',
        questionId: questions[i].id,
      })
    }

    const systemUnderTest = new TakeQuiz(
      fanRepository,
      quizRepository,
      questionRepository
    )
    const response = await systemUnderTest.execute({ quizId: quiz.id, answers })

    expect(response.success).toEqual(false)
    expect(response.message).toEqual(
      'Cannot find all the questions that were answered.'
    )
  })

  it('should not allow take a quiz with answers missing', async () => {
    const fanRepository = new InMemoryFansRepository()
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quiz = generateQuiz(fan, questions)

    questionRepository.createMany(questions)
    quizRepository.create(quiz)
    fanRepository.create(fan)

    const answers = [] as {
      chosenOption: 'a' | 'b' | 'c' | 'd'
      questionId: string
    }[]

    for (let i = 0; i < 4; i++) {
      // It'll have only 4 answers
      answers.push({
        chosenOption: 'a',
        questionId: questions[i].id,
      })
    }

    const systemUnderTest = new TakeQuiz(
      fanRepository,
      quizRepository,
      questionRepository
    )
    const response = await systemUnderTest.execute({ quizId: quiz.id, answers })

    // validade the input
    expect(questions.length).toEqual(5)
    expect(answers.length).toEqual(4)

    // validade the use case
    expect(response.message).toEqual('Some question(s) was/were not answered.')
    expect(response.success).toEqual(false)
  })

  it('should limit win FuryCoins until 10,000', async () => {
    const fanRepository = new InMemoryFansRepository()
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quiz = generateQuiz(fan, questions)

    fanRepository.create(fan)
    questionRepository.createMany(questions)
    quizRepository.create(quiz)

    fanRepository.updateFuryCoins(fan, FuryCoins.use(10_000))

    const answers = [] as {
      chosenOption: 'a' | 'b' | 'c' | 'd'
      questionId: string
    }[]

    for (let i = 0; i < 5; i++) {
      answers.push({
        chosenOption: 'a',
        questionId: questions[i].id,
      })
    }

    const systemUnderTest = new TakeQuiz(
      fanRepository,
      quizRepository,
      questionRepository
    )
    await systemUnderTest.execute({ quizId: quiz.id, answers })

    expect(quiz.props.score).toEqual(4)
    expect(questions[0].props.submittedAnswer).toEqual('a')
    expect(fan.props.furyCoins.value).toEqual(10_000)
    expect(fan.props.points.value).toEqual(300)
  })
})
