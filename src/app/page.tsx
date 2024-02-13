import dynamic from 'next/dynamic'
const SuburiCounter= dynamic(() => import('@/app/components/SuburiCounter'), { ssr: false })

export default function Home() {
  return (
    <>
      <h1>Kendo Trainer</h1>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SuburiCounter/>
      </main>
    </>
  )
}
