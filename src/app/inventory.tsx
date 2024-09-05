'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { type Note } from '@prisma/client'

import { saveInventory } from '@/server/queries'

export default function Inventory({
  inventory: initialInventory,
  note,
}: {
  inventory: { name: string; count: number }[]
  note: Note
}) {
  const [inventory, setInventory] = useState(initialInventory)
  const debouncedInventory = useDebounce(inventory, 500)
  useEffect(() => {
    async function updateInventory() {
      await saveInventory(inventory, note)
    }

    void updateInventory()
  }, [debouncedInventory])
  return (
    <ul className='divide-y divide-cb-dusty-blue'>
      {inventory.map((item, index) => (
        <li key={index} className='flex items-center py-4 first:pt-0 last:pb-0'>
          <span className='grow'>{item.name}</span>
          <input
            className='bg-cobalt'
            type='number'
            value={item.count}
            onChange={e => {
              const newInventory = inventory.map(i =>
                i.name === item.name
                  ? { ...i, count: Number(e.target.value) }
                  : i
              )
              setInventory(newInventory)
            }}
          />
        </li>
      ))}
    </ul>
  )
}
