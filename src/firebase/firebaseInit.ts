import type { FirebaseOptions } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig:FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
  
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
}

export function firebaseInit (mode:string) {

    const appCases = {
        'autoTest': () => {
            const app = initializeApp(firebaseConfig, 'coolApp')
            const auth = getAuth(app)
            const firestore = getFirestore(app)

            connectAuthEmulator(auth, 'http://127.0.0.1:9099')
            connectFirestoreEmulator(firestore, '127.0.0.1', 8080)

            return {app, auth, firestore}
        },
        'default': () => {
            if (window.location.hostname === 'localhost') {
                const app = initializeApp(firebaseConfig, 'coolApp')
                const auth = getAuth(app)
                const firestore = getFirestore(app)

                connectAuthEmulator(auth, 'http://127.0.0.1:9099')
                connectFirestoreEmulator(firestore, '127.0.0.1', 8080)

                return {app, auth, firestore}
            } else {
                const app = initializeApp(firebaseConfig)
                const auth = getAuth(app)
                const firestore = getFirestore(app)

                return {app, auth, firestore}
            }
        }
    } as {
        [key:string]: () => {
            app: FirebaseApp
            auth: Auth
            firestore: Firestore
        }
    }

    const {app, auth, firestore} = appCases[mode]()
    auth.languageCode = 'it'

    if (getApps().length <= 0) {
        throw new Error('Firebase did not initialize :-/')
    }

    return {app, auth, firestore}
}



export function getFirebase () {

    if (getApps().length <= 0) {
        const {auth, firestore} = firebaseInit('default')

        return {
            auth,
            firestore
        }
    }

    const app = getApp('coolApp')
    const auth = getAuth(app)
    const firestore = getFirestore(app)

    return {
        app,
        auth,
        firestore
    }
}