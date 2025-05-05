import type { Fan } from '../../domain/entities/fan'
import type { Question } from '../../domain/entities/question'
import { Quiz } from '../../domain/entities/quiz'

function generateQuiz(fan: Fan, questions: Question[]) {
  const quiz = Quiz.create({
    created_at: new Date(),
    fanId: fan.id,
    score: 0,
    title: 'My title',
    questionsIdentifiers: questions.map(question => question.id),
  })

  return quiz
}

function generateQuizzes(fan: Fan, questions: Question[]) {
  const quizzes = [] as Quiz[]

  for (let i = 0; i < 30; i++) {
    const quizCreated = generateQuiz(fan, questions)
    quizzes.push(quizCreated)
  }

  return quizzes
}

export { generateQuizzes, generateQuiz }
