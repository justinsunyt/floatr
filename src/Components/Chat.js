import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import {Redirect} from 'react-router-dom'
import {CSSTransition} from 'react-transition-group'
import ReactLoading from 'react-loading'

function Chat() {
    const chatRef = firebase.database().ref("chatData")
    const [loaded, setLoaded] = useState(false)
    const [isQueue, setIsQueue] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const [chatState, setChatState] = useState([])
    const [queuePos, setQueuePos] = useState(0)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName

    function fetchData(data, rec) {
        let newChatData = data
        let joined = false
        if (!newChatData.queue) {
            newChatData.queue = []
            newChatData.rooms.forEach(room => {
                if (room.users) {
                    room.users.forEach(user => {
                        if (user[0] === userId) {
                            joined = true
                        }
                    })
                }
            })
        } else {
            let inQueue = false
            newChatData.queue.forEach(user => {
                if (user[0] === userId) {
                    inQueue = true
                }
            })
            if (inQueue) {
                const qPos = newChatData.queue.findIndex(user => {
                    return user[0] === userId
                }) + 1
                setQueuePos(qPos)
                newChatData.rooms.forEach(room => {
                    if (room.users) {
                        room.users.forEach(user => {
                            if (user[0] === userId) {
                                joined = true
                            }
                        })
                    }
                })
                if (qPos % 2 === 0) { 
                    newChatData.rooms.forEach(room => {
                        if (!joined) {
                            if (!room.users) {
                                room.users = []
                                if (newChatData.queue.length >= 2 && queuePos <= 2) {
                                    room.users = room.users.concat(newChatData.queue.slice(0, 2))
                                    joined = true
                                }
                            }
                        }
                    })
                } else {
                    if (!rec) {
                        setTimeout(() => {
                            chatRef.once("value").then(snap => {
                                fetchData(snap.val(), true)
                            })
                         }, 500)
                    }
                }
                if (joined && qPos % 2 === 0) {
                    newChatData.queue.splice(0, 2)
                    chatRef.set(newChatData)
                }
            } 
        }
        if (joined) {
            setIsQueue(false)
            setRedirect(true)
        }
        setChatState(newChatData)
        setLoaded(true)
        
    }

    function handleClick() {
        let newChatState = chatState
        let inQueue = false
        if (!newChatState.queue) {
            newChatState.queue = []
        }
        newChatState.queue.forEach(user => {
            if (user[0] === userId) {
                inQueue = true
                setIsQueue(true)
            }
        })
        if (!inQueue) {
            newChatState.queue.push([userId, userDisplayName])
            setIsQueue(true)
        }
        setQueuePos(newChatState.queue.findIndex(i => {
            return i[0] === userId
        }) + 1)
        setChatState(newChatState)
        chatRef.set(newChatState)
    }

    function handleUnload() {
        chatRef.once("value").then(snap => {
            let newChatState = snap.val()
            if (newChatState.queue) {
                console.log("no")
                newChatState.queue.forEach((user, index) => {
                    console.log(user)
                    if (user[0] === userId) {
                        newChatState.queue.splice(index, 1)
                    }
                })
                chatRef.set(newChatState)
            }
        })
    }

    useEffect(() => {
        const listener = chatRef.on("value", snap => {
            fetchData(snap.val(), false)
            console.log("Fetched data: ")
            console.log(snap.val())
        }) 
        return () => {
            chatRef.off("value", listener)
            handleUnload()
        }
    }, [])
 
    if (isQueue) {
        return(
            <div>
                <div className="forum-header">
                    <ReactLoading type="bars" color="black" width="10%"/>
                </div>
                <div className="chat-queue">
                    <h2>Position in queue: {queuePos}</h2>
                </div>
            </div>
        )
    } else if (redirect) {
        return(<Redirect to="/chatroom"/>)
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="profile-header">
                        <h1>Chat</h1>
                        <button className="addpost-button" onClick={handleClick}><span>Start chatting! </span></button>
                    </div>
                    <div className="chat-rules">
                        <p>You will be matched with a random person</p>
                        <p>You cannot return to your chatroom after you leave</p>
                        <p>Be respectful and have fun!</p>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Chat