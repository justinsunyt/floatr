import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'

function AddPost() {
    const rootRef = firebase.database().ref()
    const [forumState, setForumState] = useState([])
    const [classState, setClassState] = useState([{
        "id" : 0,
        "name" : "",
        "students" : []
    }])
    const [userState, setUserState] = useState([])
    const [postState, setPostState] = useState([])
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName
    const today = new Date()

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter === 0) {
                setClassState(value)
            }
            if (counter === 1) {
                setForumState(value)
            }
            if (counter === 2) {
                setUserState(value)
            }
            counter ++
        }
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        let newPostState = postState
        if (name === "class") {
            newPostState[0] = value
        } else if (name === "title") {
            newPostState[1] = value
        } else {
            newPostState[2] = value
        }
        setPostState(newPostState)
    }
    
    function handleSubmit() {
        if (postState[0] == null) {
            alert("Please select a class")
        } else if (postState[1] === null) {
            alert("Please enter a title")
        } else if (postState[2] === null) {
            alert("Please enter some text")
        } else {
            let updatedForum = forumState
            const change = "new post"
            updatedForum.push({
                "class": postState[0].slice(1),
                "classId": parseInt(postState[0].slice(0, 1), 10),
                "comments": [],
                "creatorId": userId,
                "creatorDisplayName": userDisplayName,
                "date": JSON.stringify(today),
                "id": forumState.length,
                "likes": [],
                "text": postState[2],
                "title": postState[1]
            })
            console.log("Writing data to Firebase, change: " + change)
            rootRef.set({"classData": classState, "forumData": updatedForum, "userData": userState})
            console.log("Succesfully wrote data")
            setForumState(updatedForum)
        }
    }

    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
        // fetch forum data when component mounts
        setInterval(() => {rootRef.on("value", snap => {
            fetchData(snap.val())
        })}, 5000)
        // fetch data when database updates
    }, [])

        
    

    const classOptions = classState.map(cl => {
        if (cl.students.includes(userId)) {
            return <option value={cl.id + cl.name}>{cl.name}</option>
        }
    })

    return (
        <div className="addpost-input">
            <h2>Create a post</h2>
            <form onSubmit={handleSubmit}>
                <select name="class" onChange={handleChange}>
                    <option value="" disabled selected hidden>Choose class</option>
                    {classOptions}
                </select>
                <textarea name="title" className="addpost-title" placeholder="Title" onChange={handleChange}></textarea>
                <textarea name="text" className="addpost-text" placeholder="Text" onChange={handleChange}></textarea>
                <button className="comment-button"><span>Add post </span></button>    
            </form>
        </div>
    )
}

export default AddPost