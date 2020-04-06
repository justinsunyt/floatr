import React, { useContext } from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import Forum from './Forum'

function Profile() {
    const {currentUser} = useContext(AuthContext)
    console.log(currentUser)
    const userId = currentUser.uid
    const displayName = currentUser.displayName
    const profilePic = currentUser.photoURL

    return(
        <div>
            <div className="profile-header">
                <h1>Profile</h1>
                <button className="login-button" onClick={() => firebase.auth().signOut()}><span>Sign out </span></button>
            </div>
            <div className="profile-details">
                <img src={profilePic} alt="Profile Picture" className={"profile-pic"}/>
                <h3>{displayName}</h3>
            </div>
            <div>
                <Forum filter={userId} />
            </div>
        </div>
    )
}

export default Profile