import React, {useState, useEffect, useContext} from 'react'
import {firestore} from 'firebase/app'
import {AuthContext} from '../Auth'
import {Redirect} from 'react-router-dom'
import {CSSTransition} from 'react-transition-group'
import ReactLoading from 'react-loading'

function Chat() {
    const [userInitiated, setUserInitiated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userRef = firestore().collection("users").doc(userId)

    useEffect(() => {
        userRef.get().then(doc => {
            if (doc.exists) {
                setUserInitiated(true)
                setLoading(false)
                setLoaded(true)
            } else {
                setLoading(false)
            }
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
                    <div className="class-header">
                        <h1>Chat</h1>
                        <h3>Chat is coming soon!</h3>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Chat