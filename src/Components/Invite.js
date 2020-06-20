import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase/app'
import {firestore} from '../firebase'
import {AuthContext} from '../Auth'
import * as randomize from 'randomatic'

function Invite() {
    const mailRef = firestore.collection("mail")
    const codeRef = firestore.collection("codes")
    const {currentUser} = useContext(AuthContext)
    const userDisplayName = currentUser.displayName
    const [addressState, setAddressState] = useState("")
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const today = firebase.firestore.FieldValue.serverTimestamp()

    function handleChange(event) {
        const {value} = event.target
        setAddressState(value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (addressState.slice(-12) !== "@hwemail.com") {
            alert("You can only send an invite to an email under @hwemail.com (for more details, read below)")
        } else {
            mailRef.doc(addressState).get().then(doc => {
                if (!doc.exists) {
                    let accessCode = randomize("A0", 6)
                    codeRef.get().then(snap => {
                        let codes = []
                        snap.forEach(doc => {
                            codes.push(doc.id)
                        })
                        while (codes.includes(accessCode)) {
                            accessCode = randomize("A0", 6)
                        }
                        codeRef.doc(accessCode).set({createdAt: today})
                        mailRef.doc(addressState).set({
                            to: addressState,
                            template: {
                                name: "invite",
                                data: {
                                    username: userDisplayName,
                                    accessCode: accessCode,
                                    accessURL: "https://floatr.net"
                                }
                            }
                        })
                        setAddressState("")
                        alert("Invite has been sent successfully")
                    })
                } else {
                    alert("Another invite has already been sent to this address")
                }
            })
        }
    }

    return(
        <div className="addpost-input">
            <h2>Invite your friends to floatr!</h2>
            <form onSubmit={handleSubmit}>
                <div className="forum">
                    <input type="text" name="title" className="addpost-title" placeholder="address@hwemail.com" value={addressState} onChange={handleChange} required></input>
                </div>
            </form>
            <h4>When you invite your friend, an email will be sent to them containing an access code granting them free access to floatr! The access code expires in 7 days.</h4>
            <p>floatr is currently limited to students in Harvard-Westlake, which is why the access code can only be sent to an email under @hwemail.com; however, those invited are not required to use their HW email to sign in.</p>
        </div>
    )
}

export default Invite