/*
* @jest-environment node
*/

import { FirebaseMode, Auth as AuthEnum } from "@/enums"

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

            await authFuncs.createUser(FirebaseMode.autoTest, auth, 'magnusem4il@testing.com', 'En48$$G48', 'Magnus Carlsen')

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

    describe('getUserDoc', () => {
        
        it('should get the UserDoc from a verified user', async () => {

            await authFuncs.logIn(FirebaseMode.autoTest, auth,  'magnusverified@testing.com', 'StrongV4ry!!')

            const result = await firestoreFuncs.getUserDoc(FirebaseMode.autoTest, firestore, auth)

            console.log(result)

            expect(typeof(result)).toBe('object')

        })

        it('should not get the UserDoc from a unverified user', async () => {

            await authFuncs.logIn(FirebaseMode.autoTest, auth, 'magnusem4il@testing.com', 'En48$$G48')

            const result = await firestoreFuncs.getUserDoc(FirebaseMode.autoTest, firestore, auth)

            console.log(result)

            expect(result).toBe(AuthEnum.Errors.emailNotVerified)

        })

    })

})