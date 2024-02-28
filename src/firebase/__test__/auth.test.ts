/*
* @jest-environment node
*/

import { Auth, FirebaseMode } from "@/enums"

import { createUser } from "@/firebase"
import getTestFirebase from "./firebaseTestInit"

describe('auth', () => {

    const {auth} = getTestFirebase()

    describe('createUser', () => {

        it('should create an user with email and password', async () => {

            const result = await createUser(FirebaseMode.autoTest, auth, Auth.loginMethod.emailAndPassword, 'example@testing.com', 'Str0ngpaSs#$')

            expect(typeof(result)).toBe('object')
        })

    })

})