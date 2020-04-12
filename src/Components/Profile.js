import React, { useContext, useState, useEffect } from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import Forum from './Forum'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Profile() {
    const rootRef = firebase.database().ref()
    const [mod, setMod] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const {currentUser} = useContext(AuthContext)
    console.log(currentUser)
    const userId = currentUser.uid
    const displayName = currentUser.displayName
    const profilePic = currentUser.photoURL

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter === 2) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i].id === userId) {
                        setMod(value[i].mod)
                    }
                }
            }
            counter++
        }
        setLoading(false)
        setLoaded(true)
    }

    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
        // fetch data when component mounts
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
                        <Forum filter={userId} />
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Profile