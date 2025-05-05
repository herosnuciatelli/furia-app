import type { ResponseUseCase } from '../../types/response-usecase'
import type { ChatbotRepository } from '../repositories/ChatbotRepository'

type SendPromptRequest = {
  prompt: string
}

export class SendPrompt {
  constructor(private chatbotRepository: ChatbotRepository) {}

  async execute({
    prompt,
  }: SendPromptRequest): Promise<ResponseUseCase<string>> {
    const maxCaractersPerPrompt = 500

    if (prompt.length > maxCaractersPerPrompt) {
      return {
        data: [],
        message: 'Prompt exceeds the character limit of 500.',
        success: false,
      }
    }

    const response = await this.chatbotRepository.generateAnswer(prompt)

    return {
      data: [response],
      message: 'The prompt was send with success.',
      success: true,
    }
  }
}
