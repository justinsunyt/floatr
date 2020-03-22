import React, {useContext} from 'react'
import {Redirect} from 'react-router-dom'
import firebase from 'firebase'
import {AuthContext} from '../Auth'

function Login()
{
    const provider = new firebase.auth.GoogleAuthProvider();

    function handleLogin() {
        firebase.auth().signInWithPopup(provider).then().catch(error => {
            alert(error)
        })
    }

    const {currentUser} = useContext(AuthContext)

    if (currentUser) {
        return <Redirect to={'/'} />
    }

    return(
        <div>
            <center>
            <h1>Welcome to TaskFloat</h1>
            <p>Please login with your Google Account to continue</p>
            <button onClick={handleLogin}>Login</button>
            </center>
        </div>
      
    )
       
}
export default Login