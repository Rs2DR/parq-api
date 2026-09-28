import { Module, Provider } from '@nestjs/common';
import {
  cert,
  getApps,
  initializeApp,
  type App as FirebaseApp,
} from 'firebase-admin/app';

import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
} from './firebase.module-definition.js';
import { FirebaseService } from './firebase.service.js';
import type { FirebaseModuleOptions } from './interfaces/firebase-module-options.interface.js';
import { FIREBASE_CLIENT } from './firebase.constants.js';

const firebaseProvider: Provider = {
  provide: FIREBASE_CLIENT,
  inject: [MODULE_OPTIONS_TOKEN],
  useFactory: (options: FirebaseModuleOptions): FirebaseApp => {
    const apps = getApps();

    if (apps.length > 0) {
      return apps[0];
    }

    return initializeApp({
      credential: cert(options.credential),
      databaseURL: options.databaseURL,
    });
  },
};

@Module({
  providers: [firebaseProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule extends ConfigurableModuleClass {}
