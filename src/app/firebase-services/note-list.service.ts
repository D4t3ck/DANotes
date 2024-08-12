import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  where,
  query,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  firestore: Firestore = inject(Firestore);
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      console.log(err);
    });
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
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

  async addNote(item: Note, colId: 'notes' | 'trash') {
    let colRef;
    if (colId == 'notes') {
      colRef = this.getNotesRef();
    } else {
      colRef = this.getTrashRef();
    }
    await addDoc(colRef, item).catch((err) => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (snapshot) => {
      this.trashNotes = [];
      snapshot.forEach((doc) => {
        this.trashNotes.push(this.setNoteObject(doc.data(), doc.id));
      });
    });
  }

  subNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", false), limit(100));
    return onSnapshot(q, (snapshot) => {
      this.normalNotes = [];
      snapshot.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
      // snapshot.docChanges().forEach((change) => {
      //   if (change.type === "added") {
      //       console.log("New note: ", change.doc.data());
      //   }
      //   if (change.type === "modified") {
      //       console.log("Modified note: ", change.doc.data());
      //   }
      //   if (change.type === "removed") {
      //       console.log("Removed note: ", change.doc.data());
      //   }
      // });
    });
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", true), limit(100));
    return onSnapshot(q, (snapshot) => {
      this.normalMarkedNotes = [];
      snapshot.forEach((element) => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
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

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
