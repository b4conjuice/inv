'use server'

import { type Note } from '@prisma/client'

import { db } from './db'

export async function getNote(id: string) {
  try {
    const note = await db.note.findFirstOrThrow({
      where: {
        id,
      },
    })
    return note
  } catch (error) {
    console.error(error)
    return null
  }
}

async function saveNote(note: Note) {
  const newNote = {
    ...note,
    body: note.body,
  }
  try {
    return await db.note.update({
      where: {
        id: process.env.INVENTORY_ID!,
      },
      data: newNote,
    })
  } catch (error) {
    console.log(error)
  }
}

export async function saveInventory(
  inventory: { name: string; count: number }[],
  note: Note
) {
  const body = inventory.map(item => `${item.name}\t${item.count}`).join('\n')
  return await saveNote({
    ...note,
    body,
    text: `${note?.title ?? ''}\n\n${body}`,
    list: inventory.map(item => `${item.name}\t${item.count}`),
  })
}
