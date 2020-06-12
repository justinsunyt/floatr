import React, {useContext, useState} from 'react'
import {Redirect} from 'react-router-dom'
import * as firebase from 'firebase/app'
import {auth} from '../firebase'
import {AuthContext} from '../Auth'
import ReactLoading from 'react-loading'

function Login() {
    const provider = new firebase.auth.GoogleAuthProvider()
    const [loading, setLoading] = useState(false)

    function handleLogin() {
        setLoading(true)
        auth.signInWithPopup(provider).then(() => {
            setLoading(false)
        }).catch(error => {
            alert(error)
        })
    }

    const {currentUser} = useContext(AuthContext)

    if (loading) {
        return (
            <div className="loading-large">
                <ReactLoading type="balls" color="#ff502f" width="100%" delay={1000}/>
            </div>
        )
    } else if (currentUser) {
        return <Redirect to="/" />
    } else {
        return(
            <div>
                <center>
                <h1>floatr</h1>
                <p>Please login with your Google Account to continue</p>
                <button className="short-button" onClick={handleLogin}><span>Login </span></button>
                </center>
            </div>
        )
    }
}
export default Login