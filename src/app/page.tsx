import { unstable_noStore as noStore } from 'next/cache'

import { Main, Title } from '@/components/ui'
import { getInventory } from '@/server/queries'

function Inventory({
  inventory,
}: {
  inventory: { name: string; count: number }[]
}) {
  return (
    <ul className='divide-y divide-cb-dusty-blue'>
      {inventory.map(item => (
        <li
          key={item.name}
          className='flex items-center py-4 first:pt-0 last:pb-0'
        >
          {item.name} x {item.count}
        </li>
      ))}
    </ul>
  )
}

export default async function Home() {
  noStore()
  const inventory = await getInventory(process.env.INVENTORY_ID!)
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex flex-grow flex-col space-y-4'>
        <Title>inv</Title>
        {inventory && <Inventory inventory={inventory} />}
      </div>
    </Main>
  )
}
