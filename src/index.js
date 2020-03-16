import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase'

var config = {
    apiKey: "AIzaSyC445QrpYA0qEhP3xk9aP_WcarUJhlnNLE",
    authDomain: "taskfloat.firebaseapp.com",
    databaseURL: "https://taskfloat.firebaseio.com",
    projectId: "taskfloat",
    storageBucket: "taskfloat.appspot.com",
    messagingSenderId: "462541476562",
    appId: "1:462541476562:web:d1c6ffda73b18ccae2930b",
    measurementId: "G-XBFQG6TSP8"
}
firebase.initializeApp(config)


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
