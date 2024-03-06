/*
* @jest-environment node
*/

import { Auth, FirebaseMode } from "@/enums"

import { authFuncs } from "@/firebase"
import { signOut } from "firebase/auth"
import getTestFirebase from "./firebaseTestInit"

describe('auth', () => {

    const {auth} = getTestFirebase()

    beforeEach(async () => {
        await signOut(auth)
    })

    describe('createUser', () => {

        it('should create an user', async () => {

            const result = await authFuncs.createUser(FirebaseMode.autoTest, auth, 'example@testing.com', 'Str0ngpaSs#$', 'Krikor Mekhitarian')

            expect(result).toBe('success')
        })

        it('should not create an user if the required arguments are missing', async () => {

            // @ts-ignore
            const result = await authFuncs.createUser(FirebaseMode.autoTest, auth)

            expect(result).toBe(Auth.Errors.argumentMissing)
        })

        it('should not create an user if it is passed one or more empty arguments', async () => {

            const result1 = await authFuncs.createUser(FirebaseMode.autoTest, auth, '', 'Std5096V20$$', 'Ding Liren')

            const result2 = await authFuncs.createUser(FirebaseMode.autoTest, auth, 'coolemail@test.com', '', 'Hans Niemann')

            const result3 = await authFuncs.createUser(FirebaseMode.autoTest, auth, '', '', '')

            expect(result1).toBe(Auth.Errors.argumentMissing)
            expect(result2).toBe(Auth.Errors.argumentMissing)
            expect(result3).toBe(Auth.Errors.argumentMissing)
        })

        it('should not create an user if the provided email already is being used', async () => {

            const result = await authFuncs.createUser(FirebaseMode.autoTest, auth, 'example@testing.com', 'Str0ngpaSs#$', 'Grikor')

            expect(result).toBe(Auth.Errors.emailAlreadyInUse)
        })

    })

    describe('logIn', () => {

        it('should log in with the provided data', async () => {

            const result = await authFuncs.logIn(FirebaseMode.autoTest, auth, 'example@testing.com', 'Str0ngpaSs#$')

            console.log(result)

            expect(result).toBe('success')
        })

    })

    describe('deleteCurrentUser', () => {

        it('should delete the user logged in at the moment', async () => {

            await authFuncs.createUser(FirebaseMode.autoTest, auth, 'example@testing2.com', 'Str0ngpaSs#$29', 'Fabiano Caruana')

            await authFuncs.logIn(FirebaseMode.autoTest, auth, 'example@testing2.com', 'Str0ngpaSs#$29')

            const result = await authFuncs.deleteCurrentUser(FirebaseMode.autoTest, auth)

            expect(result).toBe('success')
        })

        it('should return an error code when there is no an user logged in', async () => {

            const result = await authFuncs.deleteCurrentUser(FirebaseMode.autoTest, auth)

            expect(result).toBe(Auth.Errors.noUserSignedIn)
        })

    })

})