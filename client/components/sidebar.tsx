import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { SIDEBAR_ITEMS } from '@/constants'
import { cn } from '@/lib/utils'
import { ArrowUpDownIcon } from 'lucide-react'
import Link from 'next/link'
import { SignOutButton } from './sign-out-button'
import { buttonVariants } from './ui/button'
import { getFanAuth } from '@/app/actions/get-fan-auth'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const Sidebar = async () => {
  const { auth } = await createClient()
  const { user } = (await auth.getUser()).data
  if (!user) redirect("/sign-in")
  const getFan = await getFanAuth(user.id)

  return (
    <aside className="px-3">
      <Popover>
        <PopoverTrigger className="flex gap-1.5 items-center w-full py-1.5 rounded-sm text-sm border px-5 md:px-12 border-dashed bg-neutral-800/50 opacity-90 hover:opacity-100">
          <ArrowUpDownIcon size={15} />
          <span className="hidden md:block">{getFan.data[0].username}</span>
        </PopoverTrigger>
        <PopoverContent className="w-max">
          <SignOutButton />
        </PopoverContent>
      </Popover>

      <nav className="mt-5 py-3 border-t border-neutral-700">
        <ul className="flex flex-col gap-2.5">
          {SIDEBAR_ITEMS.map(item => (
            <Link href={item.link} key={item.label}>
              <li
                className={cn(
                  buttonVariants({ variant: 'secondary' }),
                  'w-full flex justify-start gap-5'
                )}
              >
                <item.icon />
                <span className="hidden md:block">{item.label}</span>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

Sidebar.context = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-neutral-900 h-screen px-3 py-2.5">
      <Sidebar />
      <div className="bg-background border w-full rounded-2xl">{children}</div>
    </div>
  )
}
