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
          <span className='grow'>
            <input
              type='text'
              value={item.name}
              className='bg-cb-dusty-blue text-cb-white'
              onChange={e => {
                const newInventory = inventory.map(i =>
                  i.name === item.name ? { ...i, name: e.target.value } : i
                )
                setInventory(newInventory)
              }}
            />
          </span>
          <div className='flex overflow-hidden rounded-lg border border-cb-white/50'>
            <button
              className='bg-cb-dusty-blue p-2 text-cb-yellow hover:bg-cb-dusty-blue/75'
              type='button'
              onClick={() => {
                const newInventory = inventory.map(i =>
                  i.name === item.name ? { ...i, count: item.count - 1 } : i
                )
                setInventory(newInventory)
              }}
            >
              -
            </button>
            <input
              className='w-20 border-none bg-cb-blue text-center'
              type='number'
              value={item.count}
              step={5}
              onChange={e => {
                const newInventory = inventory.map(i =>
                  i.name === item.name
                    ? { ...i, count: Number(e.target.value) }
                    : i
                )
                setInventory(newInventory)
              }}
            />
            <button
              className='bg-cb-dusty-blue p-2 text-cb-yellow hover:bg-cb-dusty-blue/75'
              type='button'
              onClick={() => {
                const newInventory = inventory.map(i =>
                  i.name === item.name ? { ...i, count: item.count + 1 } : i
                )
                setInventory(newInventory)
              }}
            >
              +
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
