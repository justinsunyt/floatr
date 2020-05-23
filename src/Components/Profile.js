import React, { useContext, useState, useEffect } from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import Forum from './Forum'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Profile() {
    const [mod, setMod] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const displayName = currentUser.displayName
    const profilePic = currentUser.photoURL
    const usersRef = firebase.firestore().collection("users").doc(userId)

    function handleUserDoc(doc) {
        setMod(doc.mod)
        setLoaded(true)
    }

    useEffect(() => {
        usersRef.get().then(doc => {
            console.log("Fetched from users")
            handleUserDoc(doc.data())
        }).catch(err => {
            console.log("Error: ", err)
        })
    }, [])

    if (!loaded) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>   
        )
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="profile-header">
                        <h1>Profile</h1>
                        <button className="login-button" onClick={() => firebase.auth().signOut()}><span>Sign out </span></button>
                    </div>
                    <div className="profile-details">
                        <img src={profilePic} alt="Profile Picture" className={"profile-pic"}/>
                        <h3>{displayName}</h3>
                        {mod && <h5><i>Moderator</i></h5>}
                    </div>
                    <div className="profile-details"><a href="https://forms.gle/MZRy6D3pqP4K95gZ8" style={{color: "black"}}>Submit feedback / report bugs</a></div>
                    <div>
                        <Forum filter={`user/${userId}`} />
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Profile