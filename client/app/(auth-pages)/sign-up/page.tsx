import { FormMessage } from '@/components/form-message'
import type { Message } from '@/components/form-message'
import { SignUpForm } from './_components/form'

export default async function Signup(props: {
  searchParams: Promise<Message>
}) {
  const searchParams = await props.searchParams
  if ('message' in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    )
  }

  return (
    <div className="w-full flex justify-between h-screen">
      <div className="bg-[url(https://furiagg.fbitsstatic.net/img/b/a6cc98c6-8f36-426b-b156-3ba2c6e062b4.jpg)] bg-cover h-full w-1/2 hidden lg:block" />
      <div className="grid place-items-center flex-1 h-[40rem]">
        <div>
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
