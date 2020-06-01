import React, { useContext, useState, useEffect } from 'react'
import {firestore, auth} from 'firebase/app'
import {AuthContext} from '../Auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as brandIcons from '@fortawesome/free-brands-svg-icons'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Settings() {
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userEmail = currentUser.email
    const displayName = currentUser.displayName
    const profilePic = currentUser.photoURL
    const [userState, setUserState] = useState({mod: false, bio: "", displayName: displayName, profilePic: profilePic})
    const usersRef = firestore().collection("users").doc(userId)

    let bio = userState.bio && userState.bio

    function handleUserDoc(doc) {
        let newUserState = {}
        newUserState = doc
        if (!newUserState.bio) {
            newUserState.bio = ""
        }
        setUserState(newUserState)
        setLoading(false)
        setLoaded(true)
    }

    function handleChange(event) {
        const {value} = event.target
        let newUserState = {...userState}
        newUserState.bio = value
        setUserState(newUserState)
    }

    function handleSubmit(event) {
        event.preventDefault()
        usersRef.set(userState).then(() => {
            window.location.reload()
        })
        .catch(err => {
            console.log("Error: ", err)
        })
    }

    useEffect(() => {
        usersRef.get().then(doc => {
            if (doc.exists) {
                handleUserDoc(doc.data())
            } else {
                setLoading(false)
            }
        }).catch(err => {
            console.log("Error: ", err)
        })
    }, [])

    if (loading) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>   
        )
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="settings-header">
                        <h1>Settings</h1>
                        <button className="short-button" onClick={() => auth().signOut()}><span>Sign out </span></button> 
                    </div>
                    <div className="forum">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <h3>Signed in as</h3>
                                <FontAwesomeIcon icon={brandIcons.faGoogle}/> - {userEmail}
                            </div>
                            <div className="post-hr">
                                <hr />
                            </div>
                            <div>
                                <h3>Display name</h3>
                                {displayName}
                            </div>
                            <div className="post-hr">
                                <hr />
                            </div>
                            <div>
                                <h3>Bio (optional)</h3>
                                <div className="settings-input">
                                    <textarea onChange={handleChange} placeholder="Bio" maxLength="200" value={bio}></textarea>
                                    <div className="character-count">{bio.length} / 200 characters</div>
                                </div>
                            </div>
                            <div className="post-hr">
                                <hr />
                            </div>
                            <div>
                                <h3>Profile picture</h3>
                                <img src={profilePic} alt="Profile Picture" className={"profile-pic"}/>
                            </div>
                            <div className="post-hr">
                                <hr />
                            </div>
                            <div className="settings-footer">
                                <button className="long-button"><span>Update </span></button>
                            </div>
                        </form>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Settings