import { environment } from 'src/environments/environment';

export class Logger {
    static debug(...args: any[]) {
        if (!environment.production) console.debug(...args);
    }

    static info(...args: any[]) {
        if (!environment.production) console.info(...args);
    }

    static warn(...args: any[]) {
        console.warn(...args);
    }

    static error(...args: any[]) {
        console.error(...args);
        // TODO: Send issues to server? Firebase Crashlytics?
    }
}
