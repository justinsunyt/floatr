import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import {CSSTransition} from 'react-transition-group'
import ReactLoading from 'react-loading'
import Message from './Message'

function Chatroom() {
    const chatRef = firebase.database().ref("chatData")
    const [loaded, setLoaded] = useState(false)
    const [chatState, setChatState] = useState({})
    const [roomState, setRoomState] = useState({id: 0, users: [[]], messages: []})
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    let otherUserId = ""
    if (roomState.users) {
        otherUserId = roomState.users.length !== 1 ? roomState.users.map(user => (user[0] !== userId) && user[1]) : "The Other User has Left"
    }

    function fetchData(data) {
        setChatState(data)
        let selectedRoom = {}
        data.rooms.forEach(room => {
            if (room.users) {
                room.users.forEach(user => {
                    if (user[0] === userId) {
                        selectedRoom = room
                    }
                })
            }
        })
        if (!selectedRoom.messages) {
            selectedRoom.messages = []
        }
        if (!selectedRoom.users) {
            window.removeEventListener("beforeunload", handleBeforeUnload)
            window.location.reload()
        }
        setRoomState(selectedRoom)
        setLoaded(true)
    }

    function handleBeforeUnload(event) {
        event.preventDefault()
        event.returnValue = ""
    }

    function handleUnload() {
        chatRef.once("value").then(snap => {
            let newChatState = snap.val()
            for (let i = 0; i < newChatState.rooms.length; i++) {
                if (newChatState.rooms[i].users) {
                    newChatState.rooms[i].users.forEach(user => {
                        if (user[0] === userId) {
                            if (newChatState.rooms[i].users.length === 1) {
                                newChatState.rooms[i].messages = []
                            }
                            newChatState.rooms[i].users.forEach((user, index) => {
                                if (user[0] === userId) {
                                    newChatState.rooms[i].users.splice(index, 1)
                                }
                            })
                        }
                    })
                }
            }
            chatRef.set(newChatState)
        })
    }

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload)
        const listener = chatRef.on("value", snap => {
            fetchData(snap.val())
            console.log("Fetched data: ")
            console.log(snap.val())
        }) 
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
            chatRef.off("value", listener)
            handleUnload()
        }
    }, [])
    
    const messages = roomState.messages.map(msg => <Message msg={msg}/>)

    return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="profile-header">
                        <h1>{otherUserId}</h1>
                    </div>
                    <div className="chatroom">
                        {messages}
                    </div>
                    <div className='chat-form'>
                        <form>
                            <input type="text" name="msg" id="msg" autocomplete="off" required/>
                            <label for="msg" class="chat-label">
                                <span class="chat-content">Send a message</span>
                            </label>
                        </form>
                    </div>
                </div>
            </CSSTransition>
        )
}

export default Chatroom