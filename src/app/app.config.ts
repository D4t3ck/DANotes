import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'danotes-4768a',
        appId: '1:342046917566:web:1a1e7d0859612c2be7efef',
        storageBucket: 'danotes-4768a.appspot.com',
        apiKey: 'AIzaSyARoE8lDHxkH9ZQXCUkPhIDFgKiAkR6by4',
        authDomain: 'danotes-4768a.firebaseapp.com',
        messagingSenderId: '342046917566',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
