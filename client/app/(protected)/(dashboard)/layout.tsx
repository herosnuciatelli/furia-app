import { Sidebar } from '@/components/sidebar'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Sidebar.context>{children}</Sidebar.context>
    </>
  )
}
