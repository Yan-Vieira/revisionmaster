import type { Auth } from "firebase/auth"
import type { Firestore } from "firebase/firestore"
import { FirebaseMode, Auth as AuthEnum } from "@/enums"

import { getFirebase } from "."
import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore'

const chooseFirestoreInstance = (mode:string, altFireStore?:Firestore) => {

    if (mode === FirebaseMode.autoTest) {
        // TODO: replace getFirebase().firestore with throw new Error('altFirestore is not defined')
        return altFireStore || getFirebase().firestore
    } else {
        return getFirebase().firestore
    }
}

const chooseAuthInstance = (mode:string, altAuth?:Auth) => {

    if (mode === FirebaseMode.autoTest) {
        return altAuth || getFirebase().auth
    } else {
        return getFirebase().auth
    }
}


/**
 * Creates a ``user`` document associated to the user that owns the passed uid
 * @param data the data that will be associated with the user
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altFirestore if the function is being used in an automatic test, it is necessary to pass the test ``firestore`` instance
 * @returns a string indicating the success or failure from the operation
*/
export async function createUserDoc (data:FirestoreUser, mode:string = FirebaseMode.default, altFirestore?:Firestore) {

    const choseFirestore = chooseFirestoreInstance(mode, altFirestore)

    try {
        
        const result = await addDoc(collection(choseFirestore, '/users'), data)

        if (!result) return 'failure'

        return 'success'
    } catch (error) {

        return (error as any).code as string
    }
}



/**
 * Gets the ``user`` document associated to the ``auth.currentUser``
 * @param mode whether the function is being used in default mode or in an automatic test
 * @param altFirestore if the function is being used in an automatic test, it is necessary to pass the test ``firestore`` instance
 * @param altAuth if the function is being used in an automatic test, it is necessary to pass the test ``auth`` instance
 * @returns the desired ``user`` document or a string indicating the failure or error code from the operation
*/
export async function getUserDoc (mode:string = FirebaseMode.default, altFirestore?:Firestore, altAuth?:Auth) {
    
    const choseFirestore = chooseFirestoreInstance(mode, altFirestore)
    const choseAuth = chooseAuthInstance(mode, altAuth)

    try {

        if (choseAuth === null) return AuthEnum.Errors.noUserSignedIn
        if (choseAuth.currentUser?.emailVerified === false) return AuthEnum.Errors.emailNotVerified

        const q = query(collection(choseFirestore, '/users'), where('owner', '==', choseAuth.currentUser.uid))

        const result = await getDocs(q)
        .then((value) => {
            const data = value.docs

            if (data.length > 1 || data.length <= 0) return undefined

            return data[0].data() as FirestoreUser
        })

        if (!result) return 'failure'

        return result

    } catch (error) {

        return (error as any).code as string
    }
}