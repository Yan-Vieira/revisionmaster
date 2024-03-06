/*
* @jest-environment node
*/

import { FirebaseMode } from "@/enums"

import { signOut } from "firebase/auth"
import { authFuncs, firestoreFuncs } from "@/firebase"
import getTestFirebase from "./firebaseTestInit"

describe('firestore', () => {

    const {auth, firestore} = getTestFirebase()

    beforeAll(async () => {
        await signOut(auth)
    })

    describe('createUserDoc', () => {

        it('should create a user document', async () => {

            await authFuncs.logIn(FirebaseMode.autoTest, auth, 'magnusem4il@testing.com', 'En48$$G48')

            expect(auth.currentUser).not.toBeNull()

            const newFirestoreUser = {
                owner: auth.currentUser?.uid as string,
                preferences: {
                    theme: "light"
                }
            } as FirestoreUser
            
            const result = await firestoreFuncs.createUserDoc(newFirestoreUser, FirebaseMode.autoTest, firestore)

            console.log(result)

            expect(result).toBe('success')
        }, 10000)
    })
})