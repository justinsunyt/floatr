import React, {useState, useEffect} from 'react'
import * as firebase from 'firebase'
import {Link} from 'react-router-dom'
import {CSSTransition} from 'react-transition-group'
import ReactLoading from 'react-loading'

function Chat() {
    const chatRef = firebase.database().ref("chatData")
    const [loaded, setLoaded] = useState(false)
    const [isQueue, setIsQueue] = useState(false)
    const [chatState, setChatState] = useState([])

    function fetchData(data) {
        setChatState(data)
        setLoaded(true)
    }

    function handleQueue() {
        chatRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
        setIsQueue(true)
    }

    useEffect(() => {
        setLoaded(true)
    }, [])
 
    if (isQueue) {
        return(
            <div>
                <div className="forum-header">
                    <ReactLoading type="bars" color="black" width="10%"/>
                </div>
                <div className="chat-queue">
                    <h2>Position in queue: {}</h2>
                </div>
            </div>
        )
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="profile-header">
                        <h1>Chat</h1>
                        <button className="joinclass-button" onClick={handleQueue}><span>Start queue </span></button>
                    </div>
                    <div className="chat-rules">
                        <p>You will be queued with a random person</p>
                        <p>The chatroom will close when one person leaves</p>
                        <p>No chat data is saved</p>
                        <p>Be respectful and have fun!</p>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Chat