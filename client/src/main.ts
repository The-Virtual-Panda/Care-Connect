import { Logger } from '@/utils/logger';

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => Logger.error(err));
