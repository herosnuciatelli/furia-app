import { describe, expect, it } from 'vitest'
import { InMemoryQuizRepository } from '../../tests/repositories/in-memory-quiz-respository'
import {
  generateFan,
  generateQuestions,
  generateQuizzes,
} from '../../tests/utils/generate'
import { ViewQuizHistory } from './view-quiz-history'

describe('View quiz history use case', () => {
  it('should be able to view quiz history without cursors', async () => {
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quizzes = generateQuizzes(fan, questions)

    for (const quiz of quizzes) {
      quizRepository.create(quiz)
    }

    const sut = new ViewQuizHistory(quizRepository)
    const result = await sut.execute({ fanId: fan.id })

    expect(result.success).toEqual(true)
    expect(result.data.length).toEqual(10)
  })

  it('should be able to view quiz history with cursors', async () => {
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()
    const questions = generateQuestions()
    const quizzes = generateQuizzes(fan, questions)

    for (const quiz of quizzes) {
      quizRepository.create(quiz)
    }

    const sut = new ViewQuizHistory(quizRepository)
    const result = await sut.execute({
      fanId: fan.id,
      cursor: { start: quizzes[5].id },
    })

    expect(result.success).toEqual(true)
    expect(result.data.length).toEqual(10)
  })

  it('should not allow to view quiz history without quizzes', async () => {
    const quizRepository = new InMemoryQuizRepository()

    const fan = generateFan()

    const sut = new ViewQuizHistory(quizRepository)
    const result = await sut.execute({ fanId: fan.id })

    expect(result.success).toEqual(false)
    expect(result.data.length).toEqual(0)
    expect(result.message).toEqual("There's no quiz history.")
  })
})
