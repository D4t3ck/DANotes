import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  firestore: Firestore = inject(Firestore);
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash: () => void;
  unsubNotes: () => void;

  constructor() {
    this.unsubNotes = this.subNotesRef();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getsingleDocRef(colId, docId)).catch((err) => {
      console.log(err);
    });
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getsingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch((err) => {
        console.log(err);
      });
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note) {
    await addDoc(this.getNotesRef(), item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (snapshot) => {
      this.trashNotes = [];
      snapshot.forEach((doc) => {
        this.trashNotes.push(this.setNoteObject(doc.data(), doc.id));
      });
    });
  }

  subNotesRef() {
    return onSnapshot(this.getNotesRef(), (snapshot) => {
      this.normalNotes = [];
      snapshot.forEach((doc) => {
        this.normalNotes.push(this.setNoteObject(doc.data(), doc.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getsingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
