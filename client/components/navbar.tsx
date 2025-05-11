import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icons } from './Icons'
import { MaxWidthWrapper } from './max-width-wrapper'
import { Button } from './ui/button'

const Navbar = ({ children }: { children?: ReactNode }) => {
  return (
    <header className="border-b border-zinc-800 py-3 px-2.5">
      <MaxWidthWrapper className="flex justify-between items-center">
        <Link href={'/'}>
          <div className="flex items-center gap-1.5">
            <Icons.furiaLogo className="invert" />
            <span>CLUB</span>
          </div>
        </Link>
        {children}
      </MaxWidthWrapper>
    </header>
  )
}

Navbar.actions = async () => {
  const supabase = await createClient()

  const { user } = (await supabase.auth.getUser()).data

  return (
    <div className="flex items-center gap-1.5">
      {user?.id ? (
        <Button variant={'default'} asChild>
          <Link href={'/furia-ai'}>Dashboard</Link>
        </Button>
      ) : (
        <>
          <Button variant={'ghost'} asChild>
            <Link href={'/sign-up'}>Cadastrar-se</Link>
          </Button>
          <Button variant={'default'} asChild>
            <Link href={'/sign-in'}>Entrar</Link>
          </Button>
        </>
      )}
    </div>
  )
}

export { Navbar }
