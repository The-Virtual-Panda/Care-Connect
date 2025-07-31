import { provideMarkdown } from 'ngx-markdown';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        MessageService,

        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'top'
            }),
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),

        provideMarkdown(),

        providePrimeNG({
            theme: {
                options: { darkModeSelector: '.app-dark' }
            }
        }),

        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => {
            const auth = getAuth();
            if (environment.useEmulators) {
                connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            }
            return auth;
        }),
        provideFirestore(() => {
            const firestore = getFirestore();
            if (environment.useEmulators) {
                connectFirestoreEmulator(firestore, 'localhost', 8080);
            }
            return firestore;
        }),
        provideStorage(() => {
            const storage = getStorage();
            if (environment.useEmulators) {
                connectStorageEmulator(storage, 'localhost', 9199);
            }
            return storage;
        }),
        ...(environment.production ? [provideAnalytics(() => getAnalytics())] : [])
    ]
};
