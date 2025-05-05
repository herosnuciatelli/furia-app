import { Question } from '../../domain/entities/question'

function generateQuestions() {
  const questions = [
    Question.create({
      correctAnswer: 'a',
      options: [
        {
          id: 'a',
          option: 'hey',
        },
      ],
      statement: 'Choose the right one?',
      submittedAnswer: '',
    }),
    Question.create({
      correctAnswer: 'a',
      options: [
        {
          id: 'a',
          option: 'hey',
        },
      ],
      statement: 'Choose the right one?',
      submittedAnswer: '',
    }),
    Question.create({
      correctAnswer: 'a',
      options: [
        {
          id: 'a',
          option: 'hey',
        },
      ],
      statement: 'Choose the right one?',
      submittedAnswer: '',
    }),
    Question.create({
      correctAnswer: 'a',
      options: [
        {
          id: 'b',
          option: 'hey',
        },
      ],
      statement: 'Choose the right one?',
      submittedAnswer: '',
    }),
    Question.create({
      correctAnswer: 'b',
      options: [
        {
          id: 'a',
          option: 'hey',
        },
      ],
      statement: 'Choose the right one?',
      submittedAnswer: '',
    }),
  ]

  return questions
}

export { generateQuestions }
