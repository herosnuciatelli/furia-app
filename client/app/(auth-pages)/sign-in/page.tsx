import type { Message } from '@/components/form-message'
import { SignInForm } from './_components/form'

export default async function Login(props: { searchParams: Promise<Message> }) {
  return (
    <div className="w-full flex justify-between h-screen">
      <div className="bg-[url(https://furiagg.fbitsstatic.net/media/banner-performance.jpg)] bg-cover h-full w-1/2 hidden lg:block" />
      <div className="grid place-items-center flex-1 h-[40rem]">
        <div>
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
