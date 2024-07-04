import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashnotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);
  // items$;
  // items;
  unsubList;
  unsubSingle;

  constructor() {

    this.unsubList = onSnapshot(this.getNotesRef(),(list) => {
      list.forEach((element) => {
        console.log(element);
      });
    });

    this.unsubSingle = onSnapshot(this.getsingleDocRef('notes', "het9X7tLOzIwcpsHBne6"),(element) => {
      console.log(element);
      
    });

    this.unsubSingle();
    this.unsubList();
    
    // this.items$ = collectionData(this.getNotesRef());
    // this.items = this.items$.subscribe((list) => {
    //   list.forEach((element) => {
    //     console.log(element);
    //   });
    // });
    // this.items.unsubscribe();
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
