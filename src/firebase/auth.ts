import type { UserCredential, Auth } from "firebase/auth"
import { Auth as AuthEnum, FirebaseMode } from "@/enums"

import { getFirebase } from "."
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    signInWithEmailAndPassword,
    signOut,
    deleteUser
} from "firebase/auth"

const selectAuthInstance = (mode:string = FirebaseMode.default, altAuth:Auth | null) => {
    
    const modeCases = {
        'default': () => {return getFirebase().auth},
        'autoTest': () => {return altAuth || getFirebase().auth}
    } as {[key:string]: () => Auth}

    return modeCases[mode]()
}



/**
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altAuth if the function is being used in an automatic test, it is necessary to pass the test ``auth`` instance
 * @returns a string indicating the success or failure from the operation
*/
export async function createUser (mode:string = FirebaseMode.default, altAuth:Auth | null, email:string, password:string, username:string):Promise<UserCredential | string> {

    const choseAuth = selectAuthInstance(mode, altAuth)

    if (!email || email.length <= 0) return AuthEnum.Errors.argumentMissing
    if (!password || password.length <= 0) return AuthEnum.Errors.argumentMissing
    if (!username || username.length <= 0) return AuthEnum.Errors.argumentMissing

    try {
        const newUserCredential = await createUserWithEmailAndPassword(choseAuth, email, password)

        await updateProfile(newUserCredential.user, {displayName: username})

        mode === FirebaseMode.default && await sendEmailVerification(newUserCredential.user)

        await signOut(choseAuth)

        if (newUserCredential === null) return 'failure'
        
        return 'success'
    } catch (error) {
        return (error as any).code as string
    }
}


/**
 * 
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altAuth if the function is being used in an automatic test, it is necessary to pass the test ``auth`` instance
 * @returns a string indicating the success or failure from the operation
*/
export async function logIn (mode:string = FirebaseMode.default, altAuth:Auth | null, email:string, password:string) {

    const choseAuth = selectAuthInstance(mode, altAuth)

    try {

        if (!email || email.length <= 0) return AuthEnum.Errors.argumentMissing
        if (!password || password.length <= 0) return AuthEnum.Errors.argumentMissing

        await signInWithEmailAndPassword(choseAuth, email, password)

        if (choseAuth.currentUser === null) return 'failure'

        return 'success'
    } catch (error) {

        return (error as any).code as string
    }
    
}



/**
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altAuth if the function is being used in an automatic test, it is necessary to pass the test ``auth`` instance
*/
export async function logOutCurrentUser (mode:string, altAuth:Auth | null) {

    const choseAuth = selectAuthInstance(mode, altAuth)

    try {

        if (!choseAuth.currentUser) return AuthEnum.Errors.noUserSignedIn

        await signOut(choseAuth)

        if (choseAuth.currentUser) return 'failure'

        return 'success'
    } catch (error) {

        return (error as any).code as string
    }
}



/**
 * Deletes the ``auth.currentUser`` and sign it out
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altAuth if the function is being used in an automatic test, it is necessary to pass the test ``auth`` instance
 * @returns a string indicating the success or failure from the operation
 */
export async function deleteCurrentUser (mode:string, altAuth:Auth | null) {
    const choseAuth = selectAuthInstance(mode, altAuth)

    try {

        if (!choseAuth.currentUser) return AuthEnum.Errors.noUserSignedIn

        await deleteUser(choseAuth.currentUser)

        if (choseAuth.currentUser) return 'failure'

        return 'success'
    } catch (error) {

        return (error as any).code as string
    }
}