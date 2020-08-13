import React, {useContext} from 'react'
import {AuthContext} from '../Auth'

function Message(props) {
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const creator = props.msg.creator
    const text = props.msg.text
    const creatorProfilePic = props.msg.creatorProfilePic

    return (
        <li className={`msg ${creator === userId ? "right" : "left"}`}>
            {creator !== userId
                && <img src={creatorProfilePic} alt={`${creator}'s profile pic`} />
            }
            {text}
        </li>
    )
}

export default Message