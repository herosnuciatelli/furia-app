'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CircleFadingArrowUpIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { ulid } from 'ulid'

import ReactMarkdown from 'react-markdown'

type TalkItem = {
  author: 'user' | 'chatbot'
  message: string
  id: string
}

export default function FuriaAI() {
  const [talk, setTalk] = useState<TalkItem[]>([])
  const [prompt, setPrompt] = useState<string>('')
  const [isLoading, startTransition] = useTransition()

  const handlePrompt = async () => {
    if (prompt.length === 0) return
    if (isLoading) return

    setTalk([
      ...talk,
      {
        author: 'user',
        id: ulid(),
        message: prompt,
      },
    ])

    const id = ulid()
    setTalk(previousTalk => [
      ...previousTalk,
      {
        author: 'chatbot',
        message: 'Pensando...',
        id,
      },
    ])

    startTransition(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/send-prompt`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
          }
        ).then(response => response.json())

        if (!response.success) throw new Error(response.message)

        setTalk(previousTalk =>
          previousTalk.map(talk => {
            if (talk.id === id) {
              talk.message = response.data[0]
            }
            return talk
          })
        )
      } catch (error) {
        const { message } = error as { message: string }
        console.error(message)
        setTalk(previousTalk =>
          previousTalk.map(talk => {
            if (talk.id === id) {
              talk.message =
                'Sinto muito, estamos com problemas. Tente mais tarde.'
            }
            return talk
          })
        )
      }
    })

    setPrompt('')
  }

  return (
    <main className="grid grid-rows-3 h-full">
      <div
        className={cn(
          'row-start-1 row-end-3 w-1/2 flex flex-col gap-2.5 mx-auto py-10 overflow-y-auto',
          {
            'justify-center': talk.length === 0,
          }
        )}
      >
        {talk.map(speech => (
          <div
            key={speech.id}
            className={cn('flex', {
              'justify-end': speech.author === 'user',
            })}
          >
            <div
              className={cn('w-max py-2.5 px-5', {
                'bg-neutral-800 rounded-lg': speech.author === 'user',
              })}
            >
              <ReactMarkdown>{speech.message}</ReactMarkdown>
            </div>
          </div>
        ))}

        {talk.length === 0 && (
          <div className="text-center">
            <h2 className="text-3xl bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-800 bg-clip-text text-transparent">
              E aí fã, me pergunte algo sobre a FURIA!
            </h2>
          </div>
        )}
      </div>

      <div className="grid place-items-center row-start-3">
        <div className="border bg-neutral-800 px-12 w-1/2 py-5 rounded-sm flex flex-col gap-2.5 items-end">
          <Input
            className="bg-transparent w-full"
            placeholder="Pergunte alguma coisa"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={async ({ key }) => {
              if (key.toLowerCase() === 'enter') await handlePrompt()
              return
            }}
          />
          <Button
            onClick={handlePrompt}
            type="button"
            disabled={prompt.length === 0 || isLoading}
          >
            <CircleFadingArrowUpIcon />
          </Button>
        </div>
      </div>
    </main>
  )
}
