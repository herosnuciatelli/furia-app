import { describe, expect, it } from 'vitest'
import { InMemoryChatbotRepository } from '../../tests/repositories/in-memory-chatbot-repository'
import { SendPrompt } from './send-prompt'

describe('Send prompt use case', () => {
  it('should be able to send a prompt', async () => {
    const chatbotRepository = new InMemoryChatbotRepository()
    chatbotRepository.answer = 'This is my answer.'

    const prompt = 'What is your answer?'
    const sut = new SendPrompt(chatbotRepository)
    const response = await sut.execute({ prompt })

    expect(response.success).toEqual(true)
    expect(response.message).toEqual('The prompt was send with success.')
  })

  it('should not allow send a prompt that extends 500 caracters', async () => {
    const chatbotRepository = new InMemoryChatbotRepository()
    chatbotRepository.answer = 'This is my answer.'

    let prompt = ''

    for (let i = 0; i < 510; i++) {
      prompt = prompt.concat('a')
    }

    const sut = new SendPrompt(chatbotRepository)
    const response = await sut.execute({ prompt })

    expect(response.success).toEqual(false)
    expect(response.message).toEqual(
      'Prompt exceeds the character limit of 500.'
    )
  })
})
