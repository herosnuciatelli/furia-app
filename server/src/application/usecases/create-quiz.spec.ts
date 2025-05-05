import { describe, expect, expectTypeOf, it } from 'vitest'
import { Fan } from '../../domain/entities/fan'
import { Question } from '../../domain/entities/question'
import { Quiz } from '../../domain/entities/quiz'
import { Email } from '../../domain/value-objects/Email'
import { FuryCoins } from '../../domain/value-objects/FuryCoins'
import { Points } from '../../domain/value-objects/Points'
import { Username } from '../../domain/value-objects/Username'
import { InMemoryChatbotRepository } from '../../tests/repositories/in-memory-chatbot-repository'
import { InMemoryQuestionRepository } from '../../tests/repositories/in-memory-question-repository'
import { InMemoryQuizRepository } from '../../tests/repositories/in-memory-quiz-respository'
import { generateFan, generateQuestions } from '../../tests/utils/generate'
import { CreateQuiz } from './create-quiz'

describe('Create quiz use case', () => {
  it('should be able to create a quiz', async () => {
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()
    const chatbotRepository = new InMemoryChatbotRepository()

    const questions = generateQuestions()

    chatbotRepository.quiz.questions = questions
    chatbotRepository.quiz.title = 'Heros is?'

    const fan = generateFan()

    const systemUnderTest = new CreateQuiz(
      questionRepository,
      quizRepository,
      chatbotRepository
    )

    const { data, success } = await systemUnderTest.execute({ fanId: fan.id })

    const quiz = data[0]

    expect(quiz).toBeInstanceOf(Quiz)
    expect(quiz.props.fanId).toEqual(fan.id)
    expect(quiz.props.title).toEqual(chatbotRepository.quiz.title)
    expect(quiz.props.questionsIdentifiers.length).toEqual(5)
    expect(success).toEqual(true)
  })

  it('should not be able to create a quiz with a title that has more than 50 caracters', async () => {
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()
    const chatbotRepository = new InMemoryChatbotRepository()

    const questions = generateQuestions()

    chatbotRepository.quiz.questions = questions
    chatbotRepository.quiz.title = 'Heros is?'

    for (let i = 0; i < 100; i++) {
      chatbotRepository.quiz.title = chatbotRepository.quiz.title.concat(`${i}`)
    }

    const fan = generateFan()

    const systemUnderTest = new CreateQuiz(
      questionRepository,
      quizRepository,
      chatbotRepository
    )

    const { success, message } = await systemUnderTest.execute({
      fanId: fan.id,
    })

    expect(success).toBeFalsy()
    expect(message).toEqual(
      'To created a quiz, the title must have at most 50 caracters'
    )
  })

  it('should be able to create a quiz with more questions, however it should limit to 5 questions', async () => {
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()
    const chatbotRepository = new InMemoryChatbotRepository()

    const question = Question.create({
      statement: 'Which of sentences bellow is correct?',
      correctAnswer: 'd',
      options: [
        {
          id: 'a',
          option: 'Heros is smart',
        },
        {
          id: 'b',
          option: 'Heros is good looking',
        },
        {
          id: 'c',
          option: 'Heros is amazing',
        },
        {
          id: 'd',
          option: 'All of the sentences.',
        },
      ],
      submittedAnswer: '',
    })

    // 6 questions, however it should limit to 5 questions
    chatbotRepository.quiz.questions = [
      question,
      question,
      question,
      question,
      question,
      question,
    ]
    chatbotRepository.quiz.title = 'Heros is?'

    const fan = Fan.create({
      email: Email.use('heros@gmail.com'),
      furyCoins: FuryCoins.use(0),
      points: Points.use(0),
      username: Username.use('heros_nuciatelli'),
      userId: '',
    })

    const systemUnderTest = new CreateQuiz(
      questionRepository,
      quizRepository,
      chatbotRepository
    )

    const { data, success } = await systemUnderTest.execute({ fanId: fan.id })

    const quiz = data[0]

    expect(quiz).toBeInstanceOf(Quiz)
    expect(quiz.props.fanId).toEqual(fan.id)
    expect(quiz.props.title).toEqual(chatbotRepository.quiz.title)
    expect(quiz.props.questionsIdentifiers.length).toEqual(5)
    expect(success).toEqual(true)
  })

  it('should not be able to create a quiz with less than 5 questions', async () => {
    const questionRepository = new InMemoryQuestionRepository()
    const quizRepository = new InMemoryQuizRepository()
    const chatbotRepository = new InMemoryChatbotRepository()

    const question = Question.create({
      statement: 'Which of sentences bellow is correct?',
      correctAnswer: 'd',
      options: [
        {
          id: 'a',
          option: 'Heros is smart',
        },
        {
          id: 'b',
          option: 'Heros is good looking',
        },
        {
          id: 'c',
          option: 'Heros is amazing',
        },
        {
          id: 'd',
          option: 'All of the sentences.',
        },
      ],
      submittedAnswer: '',
    })

    // 4 questions
    chatbotRepository.quiz.questions = [question, question, question, question]
    chatbotRepository.quiz.title = 'Heros is?'

    const fan = Fan.create({
      email: Email.use('heros@gmail.com'),
      furyCoins: FuryCoins.use(0),
      points: Points.use(0),
      username: Username.use('heros_nuciatelli'),
      userId: '',
    })

    const systemUnderTest = new CreateQuiz(
      questionRepository,
      quizRepository,
      chatbotRepository
    )

    const { success } = await systemUnderTest.execute({ fanId: fan.id })

    expect(success).toEqual(false)
  })
})
