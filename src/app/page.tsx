import dynamic from 'next/dynamic'
import Image from 'next/image'

const Video = dynamic(()=> import('@/app/components/Video'), {ssr: false})
export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Video height={720} width={1280}  />
    // </main>
  )
}
