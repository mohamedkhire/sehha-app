import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set } from 'firebase/database'

const firebaseConfig = {
  // Your Firebase configuration
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const syncUserData = (userId: string, data: any) => {
  set(ref(database, 'users/' + userId), data)
}

export const listenToUserData = (userId: string, callback: (data: any) => void) => {
  const userRef = ref(database, 'users/' + userId)
  onValue(userRef, (snapshot) => {
    const data = snapshot.val()
    callback(data)
  })
}

