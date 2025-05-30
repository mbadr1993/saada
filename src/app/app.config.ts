import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import {
  TranslateModule,
  TranslateLoader,
  provideTranslateService,
} from '@ngx-translate/core';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, './i18n/', '.json');

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyAL2JjFck7_yRmYeAPafV6QOQyiyLQpCEg',
  authDomain: 'saada-2b934.firebaseapp.com',
  projectId: 'saada-2b934',
  storageBucket: 'saada-2b934.firebasestorage.app',
  messagingSenderId: '810886317769',
  appId: '1:810886317769:web:64766fdd7a68cfe080ef18',
  measurementId: 'G-84XTCHFP7N',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ]),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
