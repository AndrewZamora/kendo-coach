import dynamic from 'next/dynamic'
const SuburiCounter= dynamic(() => import('@/app/components/SuburiCounter'), { ssr: false })

export default function Home() {
  return (
    <>
      <h1 className='pl-24 pt-5 pb-5 text-4xl'>Kendo Suburi Counter</h1>
      <main className="flex min-h-screen  justify-between pl-24 pr-25 pb-24">
        <SuburiCounter/>
      </main>
    </>
  )
}
