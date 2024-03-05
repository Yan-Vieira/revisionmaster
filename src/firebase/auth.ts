import type { UserCredential, Auth } from "firebase/auth"
import { Auth as AuthEnum, FirebaseMode } from "@/enums"

import { getFirebase } from "."
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    deleteUser
} from "firebase/auth"



/**
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altAuth if the function is being used in an automatic test, it is necessary to pass the test ``auth`` instance
 * @param loginMethod one of the login methods described in ``Auth.loginMethod`` enum
 * @returns an ``userCredential`` instance or the error code in case of failure
*/
export async function createUser (mode:string = FirebaseMode.default, altAuth:Auth | null, email:string, password:string):Promise<UserCredential | string> {

    const modeCases = {
        'default': () => {return getFirebase().auth},
        'autoTest': () => {return altAuth || getFirebase().auth}
    } as {[key:string]: () => Auth}

    const choseAuth = modeCases[mode]()

    if (!email || email.length <= 0) return AuthEnum.Errors.argumentMissing
    if (!password || password.length <= 0) return AuthEnum.Errors.argumentMissing

    try {
        const newUserCredential = await createUserWithEmailAndPassword(choseAuth, email, password)

        mode === FirebaseMode.default && await sendEmailVerification(newUserCredential.user)

        return newUserCredential
    } catch (error) {
        return (error as any).code as string
    }
}

/**
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altAuth if the function is being used in an automatic test, it is necessary to pass the test ``auth`` instance
*/
export async function logOutCurrentUser (mode:string):Promise<string>
export async function logOutCurrentUser (mode:string, altAuth:Auth):Promise<string>
export async function logOutCurrentUser (mode:string, altAuth?:Auth) {

    const modeCases = {
        'default': () => {return getFirebase().auth},
        'autoTest': () => {return altAuth || getFirebase().auth}
    } as {[key:string]: () => Auth}

    const choseAuth = modeCases[mode]()

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
export async function deleteCurrentUser (mode:string):Promise<string>
export async function deleteCurrentUser (mode:string, altAuth:Auth):Promise<string>
export async function deleteCurrentUser (mode:string, altAuth?:Auth) {
    const modeCases = {
        'default': () => {return getFirebase().auth},
        'autoTest': () => {return altAuth || getFirebase().auth}
    } as {[key:string]: () => Auth}

    const choseAuth = modeCases[mode]()

    try {

        if (!choseAuth.currentUser) return AuthEnum.Errors.noUserSignedIn

        await deleteUser(choseAuth.currentUser)

        if (choseAuth.currentUser) return 'failure'

        return 'success'
    } catch (error) {

        return (error as any).code as string
    }
}