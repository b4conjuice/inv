'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { type Note } from '@prisma/client'
import {
  ArrowsUpDownIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'

import { saveInventory } from '@/server/queries'
import { DragDropList, Footer, FooterListItem } from '@/components/ui'

type Mode = 'default' | 'delete' | 'reorder'

export default function Inventory({
  inventory: initialInventory,
  note,
}: {
  inventory: { name: string; count: number }[]
  note: Note
}) {
  const [inventory, setInventory] = useState(initialInventory)
  const [mode, setMode] = useState<Mode>('default')
  const debouncedInventory = useDebounce(inventory, 500)
  useEffect(() => {
    async function updateInventory() {
      await saveInventory(inventory, note)
    }

    void updateInventory()
  }, [debouncedInventory])
  return (
    <>
      {mode === 'reorder' ? (
        <DragDropList
          items={inventory.map(item => ({ id: item.name, ...item }))}
          setItems={newInventory => {
            setInventory(newInventory)
          }}
          renderItem={(item, index) => {
            console.log({ item })
            return (
              <div
                className='flex items-center space-x-4 py-4 first:pt-0 last:pb-0'
                key={index}
              >
                <span className='grow'>
                  <input
                    type='text'
                    value={item.name}
                    className='w-full bg-cb-dusty-blue text-cb-white'
                    onChange={e => {
                      const newInventory = inventory.map(i =>
                        i.name === item.name
                          ? { ...i, name: e.target.value }
                          : i
                      )
                      setInventory(newInventory)
                    }}
                  />
                </span>
                <span>
                  <ArrowsUpDownIcon className='h-6 w-6' />
                </span>
              </div>
            )
          }}
          listContainerClassName='divide-y divide-cb-dusty-blue'
          itemContainerClassName='py-4 first:pt-0 last:pb-0'
        />
      ) : (
        <ul className='divide-y divide-cb-dusty-blue'>
          {inventory.map((item, index) => (
            <li
              key={index}
              className='flex items-center space-x-4 py-4 first:pt-0 last:pb-0'
            >
              <span className='grow'>
                <input
                  type='text'
                  value={item.name}
                  className='w-full bg-cb-dusty-blue text-cb-white'
                  onChange={e => {
                    const newInventory = inventory.map(i =>
                      i.name === item.name ? { ...i, name: e.target.value } : i
                    )
                    setInventory(newInventory)
                  }}
                />
              </span>
              {mode === 'default' ? (
                <div className='flex overflow-hidden rounded-lg border border-cb-white/50'>
                  <button
                    className='bg-cb-dusty-blue p-2 text-cb-yellow hover:bg-cb-dusty-blue/75'
                    type='button'
                    onClick={() => {
                      const newInventory = inventory.map(i =>
                        i.name === item.name
                          ? { ...i, count: item.count - 1 }
                          : i
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
                        i.name === item.name
                          ? { ...i, count: item.count + 1 }
                          : i
                      )
                      setInventory(newInventory)
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    // delete item by index
                    const newInventory = [...inventory]
                    newInventory.splice(index, 1)
                    setInventory(newInventory)
                  }}
                >
                  <TrashIcon className='h-6 w-6 text-red-700' />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Footer>
        <FooterListItem
          onClick={() => {
            setMode(mode === 'reorder' ? 'default' : 'reorder')
          }}
          disabled={mode === 'delete'}
        >
          {mode === 'reorder' ? (
            <XMarkIcon className='h-6 w-6' />
          ) : (
            <ArrowsUpDownIcon className='h-6 w-6' />
          )}
        </FooterListItem>
        <FooterListItem
          onClick={() => {
            const newInventory = [{ name: '', count: 0 }, ...inventory]
            setInventory(newInventory)
          }}
          disabled={mode !== 'default'}
        >
          <PlusIcon className='h-6 w-6' />
        </FooterListItem>
        <FooterListItem
          onClick={() => {
            setMode(mode === 'delete' ? 'default' : 'delete')
          }}
          disabled={mode === 'reorder'}
        >
          {mode === 'delete' ? (
            <XMarkIcon className='h-6 w-6' />
          ) : (
            <TrashIcon className='h-6 w-6' />
          )}
        </FooterListItem>
      </Footer>
    </>
  )
}
