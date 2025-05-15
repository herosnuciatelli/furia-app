'use client'
import { useTransition } from "react"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/client"
import { getFanAuth } from "@/app/actions/get-fan-auth"
import { toast } from "sonner"

export const CreateQuizButton = () => {
    const [isLoading, startTransition] = useTransition()
    const handleCreateQuiz = () => {
        const { auth } = createClient()
        startTransition(async () => {
            try {
                const { data, error} = await auth.getUser()

                if (error || !data.user.id) throw new Error(error?.message)

                const fan = await getFanAuth(data.user.id);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-quiz/${fan.data[0].id}`, {
                    next: {
                        tags: ["created-quiz"]
                    }
                }).then(response => response.json())

                console.log(response)

            } catch (error) {
                toast("Erro ao criar o quiz.")
            }

        })
    }

    return (
        <Button onClick={handleCreateQuiz} isLoading={isLoading}>Começar</Button>
    )
}