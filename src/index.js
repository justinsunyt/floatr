import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app'
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

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
