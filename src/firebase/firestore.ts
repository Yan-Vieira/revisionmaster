import type { Firestore } from "firebase/firestore"
import { FirebaseMode } from "@/enums"

import { getFirebase } from "."
import {
    collection,
    addDoc,
    getDoc
} from 'firebase/firestore'

const chooseFirestoreInstance = (mode:string, altFireStore?:Firestore) => {

    if (mode === FirebaseMode.autoTest) {
        return altFireStore || getFirebase().firestore
    } else {
        return getFirebase().firestore
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