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

        it('should create an user with email and password', async () => {

            const result = await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, 'example@testing.com', 'Str0ngpaSs#$')

            expect(typeof(result)).toBe('object')
        })

        it('should not create an user if the required arguments are missing', async () => {

            const result = await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword)

            expect(result).toBe(Auth.Errors.argumentMissing)
        })

        it('should not create an user if it is passed one or more empty arguments', async () => {

            const result1 = await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, '', 'Std5096V20$$')

            const result2 = await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, 'coolemail@test.com', '')

            const result3 = await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, '', '')

            expect(result1).toBe(Auth.Errors.argumentMissing)
            expect(result2).toBe(Auth.Errors.argumentMissing)
            expect(result3).toBe(Auth.Errors.argumentMissing)
        })

        it('should not create an user if the provided email already is being used', async () => {

            const result = await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, 'example@testing.com', 'Str0ngpaSs#$')

            console.log(result)

            expect(result).toBe(Auth.Errors.emailAlreadyInUse)
        })

    })

    describe('deleteCurrentUser', () => {

        it('should delete the user logged in at the moment', async () => {

            await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, 'example@testing2.com', 'Str0ngpaSs#$29')

            const result = await authFuncs.deleteCurrentUser(FirebaseMode.autoTest, auth)

            expect(result).toBe('success')
        })

        it('should return an error code when there is no an user logged in', async () => {

            const result = await authFuncs.deleteCurrentUser(FirebaseMode.autoTest, auth)

            expect(result).toBe(Auth.Errors.noUserSignedIn)
        })

    })

})