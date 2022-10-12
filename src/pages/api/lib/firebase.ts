import { app } from '../../../configs/firebase_admin'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FirestoreDataConverter } from 'firebase-admin/firestore'
import { UserSecret } from '../../../types/user'

export const createCustomToken = async (uid: string): Promise<string> => {
  try {
    const token = await getAuth(app).createCustomToken(uid)
    return token
  } catch (e) {
    console.error(`Failed to create custom token: ${e}`)
    throw e
  }
}

export const verifyUserToken = async (token: string) => {
  try {
    return await getAuth(app).verifyIdToken(token)
  } catch (e) {
    console.error(e)
    throw e
  }
}

const UserSecretConverter: FirestoreDataConverter<UserSecret> = {
  toFirestore: (data) => {
    return { ...data }
  },
  fromFirestore: (snapshot): UserSecret => {
    const data = snapshot.data()
    return {
      notion: {
        access_token: data.notion.access_token,
        workspace_id: data.notion.workspace_id,
        workspace_name: data.notion.workspace_name,
        workspace_icon: data.notion.workspace_icon,
        bot_id: data.notion.bot_id,
        owner: data.notion.owner,
      },
    }
  },
}

export const setUserSecrets = async (uid: string, data: UserSecret) => {
  try {
    const db = getFirestore(app)
    await db.collection('/secrets/v1/users').doc(uid).withConverter(UserSecretConverter).set(data)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const getUserSecrets = async (uid: string): Promise<UserSecret | undefined> => {
  try {
    const db = getFirestore(app)
    const user = await db
      .collection('/secrets/v1/users')
      .doc(uid)
      .withConverter(UserSecretConverter)
      .get()

    return user.data()
  } catch (e) {
    console.error(e)
    throw e
  }
}
