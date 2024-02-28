/*
* @jest-environment node
*/

import { Auth, FirebaseMode } from "@/enums"

import { authFuncs } from "@/firebase"
import getTestFirebase from "./firebaseTestInit"

describe('auth', () => {

    const {auth} = getTestFirebase()

    describe('createUser', () => {

        it('should create an user with email and password', async () => {

            const result = await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, 'example@testing.com', 'Str0ngpaSs#$')

            expect(typeof(result)).toBe('object')
        })

    })

    describe('deleteCurrentUser', () => {

        it('should delete the user logged in at the moment', async () => {

            await authFuncs.createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, 'example@testing2.com', 'Str0ngpaSs#$29')

            const result = await authFuncs.deleteCurrentUser(FirebaseMode.autoTest, auth)

            expect(result).toBe('success')
        })

    })

})