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
                <button onClick={() => firebase.auth().signOut()}>Sign out</button>
            </div>
            <div className="profile-details">
                <img src={profilePic} className={"profile-pic"}/>
                <h3>{displayName}</h3>
            </div>
            <div>
                <Forum filter={userId} />
            </div>
        </div>
    )
}

export default Profile