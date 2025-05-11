import { Navbar } from '@/components/navbar'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <div className="flex gap-12 w-full">{children}</div>
    </div>
  )
}
