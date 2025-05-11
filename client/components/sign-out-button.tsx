'use client'

import { signOutAction } from '@/app/actions'
import { LogOutIcon } from 'lucide-react'
import { Button } from './ui/button'

export const SignOutButton = () => {
  return (
    <Button variant={'outline'} onClick={signOutAction}>
      <LogOutIcon /> Encerrar sessão
    </Button>
  )
}
