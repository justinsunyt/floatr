import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function AddPost() {
    const rootRef = firebase.database().ref()
    const storageRef = firebase.storage().ref()
    const [forumState, setForumState] = useState([])
    const [classState, setClassState] = useState([{
        "id" : 0,
        "name" : "",
        "students" : []
    }])
    const [userState, setUserState] = useState([])
    const [postState, setPostState] = useState(["", "", "", false])
    const [file, setFile] = useState()
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName
    const today = new Date()
    let availableId = 0
    
    forumState.forEach(post => {
        if (post.id >= availableId) {
            availableId = post.id + 1
        }
    })

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
        setLoading(false)
        setLoaded(true)
    }
    
    function handleChange(event) {
        const {name, value, type, files} = event.target
        let newPostState = postState
        if (type === "file") {
            if (files[0].type.split('/')[0] === "image") {
                if (files[0].size > 5242880) {
                    alert("File is too big! Maximum 5MB");
                } else {
                    setFile(files[0])
                    newPostState[3] = true
                    const image = document.getElementById("image")
                    image.src = URL.createObjectURL(files[0])
                    image.classList.add("addpost-image-active")
                }
            } else {
                alert("You can only upload an image!")
            }  
        } else {
            if (name === "class") {
                newPostState[0] = value
            } else if (name === "title") {
                newPostState[1] = value
            } else {
                newPostState[2] = value
            }
        }
        setPostState(newPostState)
    }
    
    function handleSubmit(event) {
        event.preventDefault()
        if (postState[0] == null) {
            alert("Please select a class")
        } else if (postState[1] === null) {
            alert("Please enter a title")
        } else if (postState[2] === null && postState[3] === null) {
            alert("Please enter some text")
        } else {
            let updatedForum = forumState
            const change = "new post"
            if (postState[2] === "" && postState[3] === true) {
                updatedForum.push({
                    "class": postState[0].slice(1),
                    "classId": parseInt(postState[0].slice(0, 1), 10),
                    "comments": [],
                    "creatorId": userId,
                    "creatorDisplayName": userDisplayName,
                    "date": JSON.stringify(today),
                    "id": availableId,
                    "likes": [],
                    "text": null,
                    "title": postState[1],
                    "img": true
                })
                const uploadTask = storageRef.child(`forumData/images/${availableId}`).put(file)
                uploadTask.on('state_changed', function(snapshot) {
                    setLoading(true)
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('Upload is ' + progress + '% done')
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused')
                            break
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running')
                            break
                    }
                }, function(error) {
                    alert(error)
                }, function() {
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    })
                    console.log("Writing data to Firebase, change: " + change)
                    rootRef.set({"classData": classState, "forumData": updatedForum, "userData": userState})
                    console.log("Succesfully wrote data")
                    setForumState(updatedForum)
                    window.location.reload()
                })
            } else if (postState[2] !== "" && postState[3] === true) {
                updatedForum.push({
                    "class": postState[0].slice(1),
                    "classId": parseInt(postState[0].slice(0, 1), 10),
                    "comments": [],
                    "creatorId": userId,
                    "creatorDisplayName": userDisplayName,
                    "date": JSON.stringify(today),
                    "id": availableId,
                    "likes": [],
                    "text": postState[2],
                    "title": postState[1],
                    "img": true
                })
                const uploadTask = storageRef.child(`forumData/images/${availableId}`).put(file)
                uploadTask.on('state_changed', function(snapshot) {
                    setLoading(true)
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log('Upload is ' + progress + '% done')
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused')
                            break
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running')
                            break
                    }
                }, function(error) {
                    alert(error)
                }, function() {
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    })
                    console.log("Writing data to Firebase, change: " + change)
                    rootRef.set({"classData": classState, "forumData": updatedForum, "userData": userState})
                    console.log("Succesfully wrote data")
                    setForumState(updatedForum)
                    window.location.reload()
                })
            } else {
                updatedForum.push({
                    "class": postState[0].slice(1),
                    "classId": parseInt(postState[0].slice(0, 1), 10),
                    "comments": [],
                    "creatorId": userId,
                    "creatorDisplayName": userDisplayName,
                    "date": JSON.stringify(today),
                    "id": availableId,
                    "likes": [],
                    "text": postState[2],
                    "title": postState[1],
                    "img": false
                })
                console.log("Writing data to Firebase, change: " + change)
                rootRef.set({"classData": classState, "forumData": updatedForum, "userData": userState})
                console.log("Succesfully wrote data")
                setForumState(updatedForum)
                window.location.reload()
            }
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

    if (loading) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>   
        )
    } else {
        return (
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div className="addpost-input">
                    <h2>Create a post</h2>
                    <form onSubmit={handleSubmit}>
                        <select name="class" onChange={handleChange}>
                            <option value="" disabled selected hidden>Choose class</option>
                            {classOptions}
                        </select>
                        <textarea name="title" className="addpost-title" placeholder="Title" onChange={handleChange}></textarea>
                        <textarea name="text" className="addpost-text" placeholder="Text" onChange={handleChange}></textarea>
                        <div>
                            <input type="file" accept="image/*" id="file" name="file" onChange={handleChange} className="addpost-file"></input>
                            <label for="file"><span>Upload an image </span></label>
                        </div>
                        <img id="image" className="addpost-image"/>
                        <div>
                            <button className="addpost-button"><span>Add post </span></button>
                        </div>
                        
                    </form>
                </div>
            </CSSTransition>
        )
    }
}

export default AddPost