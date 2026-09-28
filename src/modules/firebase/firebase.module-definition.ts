import { ConfigurableModuleBuilder } from '@nestjs/common';
import { FirebaseModuleOptions } from './interfaces/firebase-module-options.interface.js';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FirebaseModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
