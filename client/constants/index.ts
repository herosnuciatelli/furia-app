import {
  ClipboardListIcon,
  GiftIcon,
  type LucideProps,
  MedalIcon,
  MessageCircleDashedIcon,
} from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export const SIDEBAR_ITEMS: {
  label: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  link: string
}[] = [
  {
    label: 'FURIA AI',
    icon: MessageCircleDashedIcon,
    link: '/furia-ai',
  },
  {
    label: 'Quizzes',
    icon: ClipboardListIcon,
    link: '/quizzes',
  },
  {
    label: 'Ranking',
    link: '/global-ranking',
    icon: MedalIcon,
  },
  {
    label: 'Recompensas',
    link: '/rewards',
    icon: GiftIcon,
  },
]
