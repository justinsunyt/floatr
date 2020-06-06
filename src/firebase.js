import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyDh95KqApEM_wXQwI2MdR1zq_-uPeGSQLI",
    authDomain: "floatr.net",
    databaseURL: "https://floatrrr.firebaseio.com",
    projectId: "floatrrr",
    storageBucket: "floatrrr.appspot.com",
    messagingSenderId: "61394019572",
    appId: "1:61394019572:web:50dca8cc23c2eda5232aa1",
    measurementId: "G-P7ZX0S46DQ"
}

firebase.initializeApp(config)
firebase.analytics()

export const auth =  firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()