import type { ChatbotRepository } from '../../../application/repositories/ChatbotRepository'
import { Question } from '../../../domain/entities/question'
import { answerUserMessage } from '../functions/answer-user'

export class GroqChatbotRepository implements ChatbotRepository {
  async generateAnswer(prompt: string): Promise<string> {
    const { response } = await answerUserMessage(prompt)

    return response
  }

  async generateQuiz(): Promise<{ questions: Question[]; title: string }> {
    const prompt = `Gere um JSON com exatamente 5 questões de múltipla escolha sobre a FURIA e-sports no CS:GO, incluindo sua história, jogadores, partidas marcantes e estatísticas.
            O formato deve ser exatamente o seguinte:

            {
            "questions": [
                {
                "statement": string,
                "options": [{ "id": "a" | "b" | "c" | "d", "option": string }],
                "correctAnswer": "a" | "b" | "c" | "d"
                }
            ],
            "title": "Titulo do quiz"
            }

            Apenas o JSON. Nenhum texto fora do JSON. Nenhuma explicação. Nenhum campo extra. Sempre 5 questões. Tema: FURIA no CS:GO.
            O retorno deve ser sempre em json (sem incluir \`\`\` no inicio ou no fim).
            `

    const { response } = await answerUserMessage(prompt)

    const cleanText = response.replace(/^```|```$/g, '')
    const { questions, title } = JSON.parse(cleanText)

    const questionsGenerated = [] as Question[]

    for (const question of questions) {
      questionsGenerated.push(
        Question.create({
          correctAnswer: question.correctAnswer,
          options: question.options,
          statement: question.statement,
          submittedAnswer: '',
        })
      )
    }

    return { questions: questionsGenerated, title }
  }
}
