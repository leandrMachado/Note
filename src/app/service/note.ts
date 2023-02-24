export class Note {
    id: number 
    title: string
    note: string
 
    constructor(_title: string ,_note: string, _id: number,){
        this.id = _id
        this.title = _title
        this.note = _note
    }
}