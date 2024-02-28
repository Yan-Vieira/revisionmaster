import { firebaseInit } from "../firebaseInit"

const{app, auth, firestore} = firebaseInit('autoTest')

/**
 * Used in automated tests to get firebase correctly
*/
export default function getTestFirebase () {
    
    return {
        app,
        auth,
        firestore
    }
}