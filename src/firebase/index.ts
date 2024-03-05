import { getFirebase } from "./firebaseInit"
import * as authFuncs from "./auth"
import * as firestoreFuncs from './firestore'

/**
 * Every functions that allow the communication between frontend and firebase services
*/
export {
    getFirebase,
    authFuncs,
    firestoreFuncs
}