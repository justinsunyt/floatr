import React, { useContext, useState, useEffect } from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import Forum from './Forum'
import {Link, Redirect} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Profile() {
    const [userState, setUserState] = useState({})
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [userInitiated, setUserInitiated] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const displayName = currentUser.displayName
    const profilePic = currentUser.photoURL
    const userRef = firebase.firestore().collection("users").doc(userId)

    function handleUserDoc(doc) {
        setUserState(doc)
        setLoading(false)
        setLoaded(true)
    }

    useEffect(() => {
        userRef.get().then(doc => {
            if (doc.exists) {
                setUserInitiated(true)
                console.log("Fetched from users")
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
    } else if (!userInitiated) {
        return <Redirect to="settings"/>
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="profile-header">
                        <Link to="/settings" data-tip="Settings" data-offset="{'bottom': 3}"><FontAwesomeIcon className="profile-settings" icon={solidIcons.faCog}/></Link>
                        <ReactTooltip effect="solid" delayShow={500} scrollHide={false} place="bottom"/>
                    </div>
                    <div className="profile-details">
                        <img src={profilePic} alt="Profile Picture" className="profile-pic"/>
                        <div className="profile-text">
                            <h1>{displayName}</h1>
                            {userState.mod && <h5><i>Moderator</i></h5>}
                            {userState.bio}
                        </div>
                    </div>
                    <div>
                        <Forum filter={`user/${userId}`} />
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Profile