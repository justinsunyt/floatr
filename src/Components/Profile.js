import React, { useContext } from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'

function Profile() {
    const {currentUser} = useContext(AuthContext)
    console.log(currentUser)
    const displayName = currentUser.displayName
    return(
        <div className="profile-header">
            <h1>Profile</h1>
            <button onClick={() => firebase.auth().signOut()}>Sign out</button>
            <p>{displayName}</p>
        </div>
    )
}

export default Profile