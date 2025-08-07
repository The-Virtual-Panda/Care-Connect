import { baseEnvironment } from './environment.base';

export const environment = {
    ...baseEnvironment,
    firebase: {
        projectId: 'demo-care-connect',
        appId: 'demo:local:web:demo',
        storageBucket: 'demo-care-connect.appspot.com',
        apiKey: 'demo-local-key',
        authDomain: 'demo-care-connect.firebaseapp.com',
        messagingSenderId: 'demo',
        measurementId: 'G-LOCAL'
    },
    production: false,
    useEmulators: true
};
