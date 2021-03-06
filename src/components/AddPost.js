import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase/app'
import {firestore, storage} from '../firebase'
import {AuthContext} from '../Auth'
import {Redirect} from 'react-router-dom'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function AddPost() {
    const forumRef = firestore.collection("forum")
    const classesRef = firestore.collection("classes")
    const storageRef = storage.ref()
    const [classState, setClassState] = useState([{
        "id" : "",
        "name" : "",
        "students" : []
    }])
    const [postState, setPostState] = useState([null, "", "", false])
    const [file, setFile] = useState()
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName
    const today = firebase.firestore.FieldValue.serverTimestamp()

    function handleChange(event) {
        const {name, value, type, files, selectedIndex} = event.target
        let newPostState = [...postState]
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
                newPostState[0] = [value, event.target[selectedIndex].text]
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
        } else if (postState[1] === "") {
            alert("Please enter a title")
        } else if ((postState[2] === "") && postState[3] === false) {
            alert("Please enter some text")
        } else {
            let newPost = {
                "class": postState[0][1],
                "classId": postState[0][0],
                "creatorId": userId,
                "creatorDisplayName": userDisplayName,
                "date": today,
                "likes": [],
                "numComments": 0,
                "text": null,
                "title": postState[1],
                "img": false,
                "reports": []
            }
            if (postState[2] === "" && postState[3] === true) {
                newPost.img = true
                forumRef.add(newPost).then(docRef => {
                    const uploadTask = storageRef.child(`forum/images/${docRef.id}`).put(file)
                    uploadTask.on('state_changed', function(snapshot) {
                        setLoaded(false)
                        setLoading(true)
                        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        console.log('Upload is ' + progress + '% done')
                    }, function(error) {
                        alert(error)
                    }, function() {
                        setLoading(false)
                        setRedirect(true)
                    })
                }).catch(err => {
                    console.log("Error: ", err)
                })  
            } else if (postState[2] !== "" && postState[3] === true) {
                newPost.text = postState[2]
                newPost.img = true
                forumRef.add(newPost).then(docRef => {
                    const uploadTask = storageRef.child(`forum/images/${docRef.id}`).put(file)
                    uploadTask.on('state_changed', function(snapshot) {
                        setLoaded(false)
                        setLoading(true)
                        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        console.log('Upload is ' + progress + '% done')
                    }, function(error) {
                        alert(error)
                    }, function() {
                        setLoading(false)
                        setRedirect(true)
                    })
                }).catch(err => {
                    console.log("Error: ", err)
                })
            } else {
                newPost.text = postState[2]
                forumRef.add(newPost).then(() => {
                    setRedirect(true)
                }).catch(err => {
                    console.log("Error: ", err)
                })
            }
        }
    }

    useEffect(() => {
        classesRef.where("students", "array-contains", userId).orderBy("name")
        .get().then(snap => {
            let newClassState = []
            snap.forEach(doc => {
                let cl = doc.data()
                cl.id = doc.id
                newClassState.push(cl)
            })
            setClassState(newClassState)
            setLoading(false)
            setLoaded(true)
        }).catch(err => {
            console.log("Error: ", err)
        })
    }, [])

    const classOptions = classState.map(cl => {
        if (cl.students.includes(userId)) {
            return <option value={cl.id} key={cl.id}>{cl.name}</option>
        }
    })

    if (loading) {
        return (
            <div className="loading-large">
                <ReactLoading type="balls" color="#ff502f" width="100%" delay={1000}/>
            </div>   
        )
    } else if (redirect) {
        return <Redirect to="/"/>
    } else {
        return (
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div className="addpost-input">
                    <h2>Create a post</h2>
                    <form onSubmit={handleSubmit}>
                        <select name="class" onChange={handleChange} defaultValue="">
                            <option value="" disabled hidden>Choose class</option>
                            {classOptions}
                        </select>
                        <div className="forum">
                            <input type="text" name="title" className="addpost-title" placeholder="Title" value={postState[1]} onChange={handleChange} required></input>
                            <div className="post-hr">
                                <hr />
                            </div>
                            <textarea name="text" className="addpost-text" placeholder="Text" value={postState[2]} onChange={handleChange} maxLength="3000"></textarea>
                            <div className="character-count">{postState[2].length} / 3000 characters</div>
                        </div>
                        <div>
                            <input type="file" accept="image/*" id="file" name="file" onChange={handleChange} className="addpost-file"></input>
                            <label htmlFor="file">Upload an image</label>
                        </div>
                        <img id="image" className="addpost-image"/>
                        <div>
                            <button className="short-button width-150"><span>Add post </span></button>
                        </div>
                        
                    </form>
                </div>
            </CSSTransition>
        )
    }
}

export default AddPost