import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Note } from './service/note';
import { NoteService } from './service/notes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  existingNotes: Note[] = []
  markdownText = new FormControl('')
  noteSelected: Note = new Note('', '', 0)

  createNote: boolean = true
  readNote: boolean = false
  editMode: boolean = false

  openMenu: boolean = false

  constructor(private noteService: NoteService){
    this.reloadNotes()
  }

  createNotes() {
    this.createNote =  true
    this.markdownText.reset()
  }

  reloadNotes() {
    this.noteService.getNotesFromDatabase().then((res) => {
      this.existingNotes = res
    })
  }

  openNoteFromList(noteId: number) {
    this.noteService.getNoteFromDatabaseById(noteId).then((res) => {
      this.noteSelected = res
      this.readNote = true
      this.createNote = false
      this.openMenu = false
    })
  }

  openNoteToEdit(noteId: number) {
    this.noteService.getNoteFromDatabaseById(noteId).then((res) => {
      this.markdownText.patchValue(res.note)
      this.noteSelected = res
      this.createNote = true
      this.readNote = false
      this.editMode = true
      this.openMenu = false
    })
  }

  onSaveNotes(){
    if(this.editMode === true){
      this.editNoteInDatabase(this.noteSelected.id)
      this.editMode = false
      this.openNoteFromList(this.noteSelected.id)
    }
    else this.addNoteToDatabase()
  }

  addNoteToDatabase(){
    var markdownLines = this.markdownText.value?.split('\n')
    var markdownTitle = markdownLines?.find(elm => elm.includes('#')) ?? "# New note"

    var markdownTextValue = this.markdownText.value ?? ""

    this.noteService.addNoteToDatabase(markdownTitle, markdownTextValue)
      .then(() => { 
        console.log('Note created successfully')
        this.markdownText.reset()
        this.reloadNotes()
      })
      .catch(error => console.error('There was an error creating the note: ', error))
  }

  editNoteInDatabase(noteId: number){
    var markdownLines = this.markdownText.value?.split('\n')
    var markdownTitle = markdownLines?.find(elm => elm.includes('#')) ?? "# New note"

    var markdownTextValue = this.markdownText.value ?? ""

    this.noteService.updateNoteInDatabase(noteId, markdownTitle, markdownTextValue)
      .then(() => { 
        console.log('Note updated successfully')
        this.markdownText.reset()
        this.reloadNotes()
      })
      .catch(error => console.error('There was an error update the note: ', error))
  }

  deleteNoteFromDatabase(noteId: number){
    this.noteService.deleteNoteFromDatabase(noteId)
      .then(() => {
        console.log('Note removed successfully')
        this.reloadNotes()
      })
      .catch(error => console.error('There was an error removing the note: ', error))
  }

}
