import React from 'react'
import * as firebase from 'firebase'

function Profile() {
    return(
        <div className="profile-header">
            <h1>Profile</h1>
            <button onClick={() => firebase.auth().signOut()}>Sign out</button>
        </div>
    )
}

export default Profile