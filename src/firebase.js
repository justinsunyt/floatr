import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

let config = {}

if (process.env.NODE_ENV === "production") {
    config = {
        apiKey: "AIzaSyDh95KqApEM_wXQwI2MdR1zq_-uPeGSQLI",
        authDomain: "floatr.net",
        databaseURL: "https://floatrrr.firebaseio.com",
        projectId: "floatrrr",
        storageBucket: "floatrrr.appspot.com",
        messagingSenderId: "61394019572",
        appId: "1:61394019572:web:50dca8cc23c2eda5232aa1",
        measurementId: "G-P7ZX0S46DQ"
    }
} else {
    config = {
        apiKey: "AIzaSyC445QrpYA0qEhP3xk9aP_WcarUJhlnNLE",
        authDomain: "taskfloat.firebaseapp.com",
        databaseURL: "https://taskfloat.firebaseio.com",
        projectId: "taskfloat",
        storageBucket: "taskfloat.appspot.com",
        messagingSenderId: "462541476562",
        appId: "1:462541476562:web:d1c6ffda73b18ccae2930b",
        measurementId: "G-XBFQG6TSP8"
    }
}

firebase.initializeApp(config)
firebase.analytics()

export const auth =  firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()