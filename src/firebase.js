import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import devConfig from './configs/devConfig'
import prodConfig from './configs/prodConfig'

let config = {}

if (process.env.NODE_ENV === "production") {
    config = prodConfig
} else {
    config = devConfig
}

firebase.initializeApp(config)
firebase.analytics()

export const auth =  firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()   