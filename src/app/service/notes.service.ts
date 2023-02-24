import { Injectable } from '@angular/core';
import { Note } from './note';
@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor() { }

  async getNotesFromDatabase(): Promise<Note[]> {
    return new Promise((resolve, reject) => {

      fetch('http://localhost:3000/note', {

        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }

      })
      .then(response => response.json())
      .then(data => {

        const notes = data.map((note: Note)=> new Note(note.title, note.note, note.id))
        resolve(notes)

      })
      .catch(error => reject(error))

    })
  }

  async getNoteFromDatabaseById(noteId: number): Promise<Note> {
    return new Promise((resolve, reject) => {

      fetch(`http://localhost:3000/note/${noteId}`, {

        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }

      })
      .then(response => response.json())
      .then((note: Note) => {

        const notes = new Note(note.title, note.note, note.id)
        resolve(notes)

      })
      .catch(error => reject(error))

    })
  }

  async addNoteToDatabase(title: string, note: string): Promise<void> {
    const newNote = { "title": title, "note": note }

    return fetch(`http://localhost:3000/note/create`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)

    })
    .then(response => response.json())
    .catch(error => console.error(error))
  }

  async updateNoteInDatabase(noteId: number, title: string, note: string): Promise<void> {
    const updateNote = { "title": title, "note": note }

    return fetch(`http://localhost:3000/note/${noteId}/update`, {

      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateNote)

    })
    .then(response => response.json())
    .catch(error => console.error(error))
  }


  async deleteNoteFromDatabase(noteId: number): Promise<void> {

    return fetch(`http://localhost:3000/note/${noteId}/delete`, {

      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },

    })
    .then(response => response.json())
    .catch(error => console.error(error))
    
  }



}
