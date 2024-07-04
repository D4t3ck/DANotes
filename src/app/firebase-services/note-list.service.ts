import { inject, Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashnotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);

  constructor() { }

  // const itemCollection = collection(this.firestore, 'items');

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getsingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
