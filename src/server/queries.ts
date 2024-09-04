'use server'

import { db } from './db'

export async function getInventory(id: string) {
  try {
    const note = await db.note.findFirstOrThrow({
      where: {
        id,
      },
    })
    const inventory = note.list.map(item => {
      const [name, count] = item.split('\t')
      return { name: name ?? '', count: Number(count ?? 0) }
    })
    return inventory
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function saveInventory(note: {
  id?: string
  text?: string
  title?: string
  body?: string
  author: string
}) {
  const text = note.text ?? 'untitled\nbody'
  const title = note.title ?? 'untitled'

  const newNote = {
    text,
    title,
    body: note.body ?? 'body',
    author: note.author,
  }

  try {
    return await db.note.upsert({
      where: {
        id: note.id ?? '',
      },
      update: newNote,
      create: newNote,
    })
  } catch (error) {
    console.log(error)
  }
}
