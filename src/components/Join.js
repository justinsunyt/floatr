import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase/app'
import {firestore} from '../firebase'
import {AuthContext} from '../Auth'

function Invite() {
    const codeRef = firestore.collection("codes")
    const [codeState, setCodeState] = useState("")
    const {currentUser, incrementUserStage} = useContext(AuthContext)
    const userId = currentUser.uid
    const displayName = currentUser.displayName
    const profilePic = currentUser.photoURL
    const usersRef = firestore.collection("users").doc(userId)

    function handleChange(event) {
        const {value} = event.target
        setCodeState(value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        let sevenAgo = new Date()
        sevenAgo = sevenAgo.setDate(sevenAgo.getDate() - 7)
        codeRef.doc(codeState).get().then(doc => {
            if (doc.exists) {
                if (doc.data().createdAt.toDate() >= sevenAgo) {
                    codeRef.doc(codeState).delete().then(
                        usersRef.set({mod: false, bio: "", displayName: displayName, profilePic: profilePic, userStage: 0}).then(() => {
                            incrementUserStage(() => {})
                        })
                        .catch(err => {
                            console.log("Error: ", err)
                        })
                    )
                } else {
                    alert("The access code has expired")
                }
            } else {
                alert("Invalid access code")
            }
        })
    }

    return(
        <div className="addpost-input">
            <h2>Enter your access code to continue</h2>
            <form onSubmit={handleSubmit}>
                <div className="textbox">
                    <input type="text" name="title" className="addpost-title" placeholder="Enter code here" value={codeState} onChange={handleChange} required></input>
                </div>
            </form>
            <h4>An access code is required to join floatr. If you have a friend using floatr, ask them for an invite!</h4>
            <p><a style={{color: "black"}} href="https://forms.gle/Psc1iFNoJgC6RXyn6" target="_blank">Request access code</a></p>
        </div>
)
}

export default Invite