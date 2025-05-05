import { generateText } from 'ai'
import { groq } from '../groq'

export async function answerUserMessage(prompt: string) {
  const promptConfig = `
    Eu sou um fa da FURIA e-sports me de uma saudacao para eu ficar mais animado e curioso sobre a FURIA, me trate como se voce fosse um membro da furia o chatbot deles interaja comigo humanamente
    `

  const { text } = await generateText({
    model: groq,
    prompt: `${promptConfig} - ${prompt}`,
  })

  return { response: text }
}
