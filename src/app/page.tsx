import dynamic from 'next/dynamic'

const VideoCanvas = dynamic(()=> import('@/app/components/VideoCanvas'), {ssr: false})
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideoCanvas height={540} width={720} mirror={true}  />
    </main>
  )
}
