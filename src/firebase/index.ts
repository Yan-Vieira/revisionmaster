import { getFirebase } from "./firebaseInit"
import { createUser, deleteCurrentUser } from "./auth"

const authFuncs = {
    createUser,
    deleteCurrentUser
}

/**
 * Every functions that allow the communication between frontend and firebase services
*/
export {
    getFirebase,
    authFuncs
}