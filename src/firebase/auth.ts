import type { UserCredential, Auth } from "firebase/auth"
import { Auth as AuthEnum, FirebaseMode } from "@/enums"

import { getFirebase } from "."
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    deleteUser
} from "firebase/auth"

/**
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altAuth if the function is being used in an automatic test, it is necessary to pass the test ``auth`` instance
 * @param loginMethod one of the login methods described in ``Auth.loginMethod`` enum
 * @returns an ``userCredential`` instance or the error code in case of failure
*/
export async function createUser (mode:string, altAuth:Auth | null, loginMethod:string):Promise<UserCredential | string>
export async function createUser (mode:string, altAuth:Auth | null, loginMethod:string, email:string, password:string):Promise<UserCredential | string>
export async function createUser (mode:string = FirebaseMode.default, altAuth:Auth | null, loginMethod:string, email?:string, password?:string):Promise<UserCredential | string> {

    const modeCases = {
        'default': () => {return getFirebase().auth},
        'autoTest': () => {return altAuth || getFirebase().auth}
    } as {[key:string]: () => Auth}

    const choseAuth = modeCases[mode]()

    const cases = {
        'emailAndPassword': async () => {
            if (!email || !password) return AuthEnum.Errors.argumentMissing

            try {
                const result = await createUserWithEmailAndPassword(choseAuth, email, password)

                return result
            } catch (error) {
                return (error as any).code as string
            }
        },
        'google': async () => {
            try {
                const result = await signInWithPopup(choseAuth, new GoogleAuthProvider())

                return result
            } catch (error) {
                return (error as any).code as string
            }
        }
    } as {
        [key: string]: (email?:string, password?:string) => Promise<UserCredential | string>,
    }

    if (!cases[loginMethod]) return AuthEnum.Errors.invalidLoginMethod

    return cases[loginMethod](email, password)
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

        return 'failure'
    }
}