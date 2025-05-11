'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export const formSchema = z.object({
  email: z
    .string()
    .email('Formato inválido.')
    .min(1, 'Preencha o campo de e-mail')
    .max(40, 'Limite ultrapassado'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres.'),
})

export const SignUpForm = () => {
  const [viewPass, setViewPass] = React.useState<boolean>(false)
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()

  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async ({
    email,
    password,
  }: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        // crio a conta do meu usuario
        const {
          error,
          data: { user },
        } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw new Error(error.message)

        toast('Conta criada!', {
          description: 'Voce já pode efetuar o login.',
        })

        setTimeout(() => router.push('/sign-in'), 300)
      } catch (error) {
        const { message } = error as { message: string }

        toast('', {
          description: message,
        })
      }
    })
  }

  return (
    <Form {...form}>
      <div className="pb-5">
        <h1 className="text-2xl font-medium">Cadastre-se</h1>
        <p className="text-sm text text-foreground">
          Já possui uma conta?{' '}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Entrar
          </Link>
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex max-w-sm w-sm flex-col gap-5 rounded-md border p-4 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="flex flex-col gap-1">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-xs">Email</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-xs">Senha</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <label htmlFor="password">
                        {viewPass && (
                          <EyeIcon
                            onClick={() => setViewPass(!viewPass)}
                            className="absolute right-3 size-4 -translate-y-1/2 cursor-pointer text-neutral-400 transition-all hover:text-neutral-400/80"
                          />
                        )}
                        {!viewPass && (
                          <EyeOffIcon
                            onClick={() => setViewPass(!viewPass)}
                            className="absolute right-3 size-4 -translate-y-1/2 cursor-pointer text-neutral-400 transition-all hover:text-neutral-400/80"
                          />
                        )}
                      </label>
                      <Input
                        type={viewPass ? 'text' : 'password'}
                        {...field}
                        className="mt-0"
                        id="password"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        <div>
          <Button
            className="flex w-full gap-1"
            disabled={isPending}
            isLoading={isPending}
          >
            Entrar
          </Button>
        </div>
      </form>
    </Form>
  )
}
