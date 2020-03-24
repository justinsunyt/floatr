import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'

function AddPost() {
    const rootRef = firebase.database().ref()
    const [forumState, setForumState] = useState([])
    const [classState, setClassState] = useState([])
    const [postState, setPostState] = useState([])
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter == 0) {
                setClassState(value)
            }
            if (counter == 1) {
                setForumState(value)
            }
            counter ++
        }
    }
    
    function handleChange() {

    }
    
    function handleSubmit() {

    }

    return (
        <div className="comment-input">
            <form>
            <textarea name="title" className="addpost-title" placeholder="Title" onChange={handleChange}></textarea>
                <textarea name="text" className="addpost-text" placeholder="Text" onChange={handleChange}></textarea>
                <button onClick={handleSubmit} className="comment-button"><span>Add post </span></button>    
            </form> 
        </div>
    )
}

export default AddPost