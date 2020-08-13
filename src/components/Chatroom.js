import React, {useState} from 'react'
import {CSSTransition} from 'react-transition-group'
import Message from './Message'

function Chatroom() {
    const [loaded, setLoaded] = useState(false)

    function scrollToBottom() {
        const chatroom = document.getElementById("chatroom")
        chatroom.scrollTop = chatroom.scrollHeight
    }

    function handleBeforeUnload(event) {
        event.preventDefault()
        event.returnValue = ""
    }

    return(
        <CSSTransition in={loaded} timeout={300} classNames="fade">
            <div>
                <div className="profile-header">
                </div>
                <div className="chatroom" id="chatroom">
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