import { unstable_noStore as noStore } from 'next/cache'

import Inventory from './inventory'
import { Main, Title } from '@/components/ui'
import { getNote } from '@/server/queries'

export default async function Home() {
  noStore()
  const note = await getNote(process.env.INVENTORY_ID!)
  const inventory =
    note?.list.map(item => {
      const [name, count] = item.split('\t')
      return { name: name ?? '', count: Number(count ?? 0) }
    }) ?? []
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex flex-grow flex-col space-y-4'>
        <Title>inv</Title>
        {note && <Inventory inventory={inventory} note={note} />}
      </div>
    </Main>
  )
}
