import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {Link, Redirect} from 'react-router-dom'
import {AuthContext} from '../Auth'

function ForumDetail({match}) {
    const rootRef = firebase.database().ref()
    const forumRef = firebase.database().ref('taskfloat/forumData')
    const [forumState, setForumState] = useState([])
    const [classState, setClassState] = useState([])
    const [userState, setUserState] = useState([])
    const [id, setId] = useState(0)
    const [postState, setPostState] = useState({
        "class" : "",
        "classId" : "",
        "comments" : [],
        "creatorId" : "",
        "creatorDisplayName" : "",
        "date" : "",
        "id" : 0,
        "likes" : [],
        "text" : "",
        "title" : ""
    })
    const [commentState, setCommentState] = useState("")
    const [mod, setMod] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName

    let liked = forumState.map(post => (post.likes.includes(userId)) ? true : false)

    let title = postState.title
    let text = postState.text
    let date = new Date (postState.date)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let creatorId = postState.creatorId
    let creatorDisplayName = postState.creatorDisplayName
    let numLikes = postState.likes.length
    let comments = postState.comments
    let numComments = postState.comments.length
    let className = postState.class
    let classId = postState.classId

    const linkStyle = {
        color: "black",
        textDecoration: "none",
        cursor: "pointer"
    }

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter == 0) {
                setClassState(value)
            }
            if (counter == 1) {
                let ids = []
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["comments"] === undefined){
                        value[i]["comments"] = []
                    }
                    // initialize "comments" if undefined
                    if (value[i]["likes"] === undefined){
                        value[i]["likes"] = []
                    }
                    // initialize "likes" if undefined
                    ids.push(value[i].id)
                }
                if (ids.includes(parseInt(match.params.id))) {
                    setForumState(value)
                    setId(match.params.id)
                    for (let i = 0; i < value.length; i++) {
                        if (value[i].id == match.params.id) {
                            setPostState(value[i])
                        }
                    }
                } else {
                    alert("This post has been deleted")
                    window.location.reload()
                }
            }
            if (counter == 2)  {
                setUserState(value)
                for (let i = 0; i < value.length; i++) {
                    if (value[i].id == userId) {
                        setMod(value[i].mod)
                    }
                }
            }
            counter ++
        }
    }

    function handleChange(event) {
        const {value, type} = event.target
        let change = ""
        if (type === "checkbox") {
            setForumState(prevForum => {
                const updatedForum = prevForum.map(post => {
                    let newPost = post
                    if (post.id == id) {
                        if (post.likes.includes(userId)) {
                            const filteredLikes = post.likes.filter(value => {
                                if (value != userId) {
                                    return value
                                }
                            })
                            newPost.likes = filteredLikes
                            change = "unliked post"
                            // if post is liked, unlike post
                        } else {
                            if (!newPost.likes) {
                                newPost.likes = []
                            }
                            newPost.likes.push(userId)
                            change = "liked post"
                            // if post is unliked, like post
                        }
                    }
                    console.log(newPost)
                    return newPost
                })
                console.log("Writing data to Firebase, change: " + change)
                rootRef.set({"classData": classState, "forumData": updatedForum, "userData": userState})
                console.log("Succesfully wrote data")
                return updatedForum
            })
        }
        else if (type === "textarea") {
            setCommentState(value)
        }
        console.log("New state:")
        console.log(forumState)
    }

    function handleSubmit() {
        if (commentState == "") {
            alert("You cannot comment nothing")
        } else {
            let change = ""
            setForumState(prevForum => {
                const updatedForum = prevForum.map(post => {
                    let newPost = post
                    if (post.id == id) {
                        let newComment = {}
                        newComment[userDisplayName] = commentState
                        newPost.comments.push(newComment)
                    }
                    change = "new comment"
                    console.log(newPost)
                    return newPost
                })
                console.log("Writing data to Firebase, change: " + change)
                rootRef.set({"classData": classState, "forumData": updatedForum, "userData": userState})
                console.log("Succesfully wrote data")
                return updatedForum
            })
            console.log("New state:")
            console.log(forumState)
            document.getElementById("comment").value = ""
        }
    }

    function handleDelete() {
        if (window.confirm("Are you sure you want to delete this post?\nThis action is irreversible")) {
            const change = "Deleted post"
            let updatedForum = forumState
            for (let i = 0; i < updatedForum.length; i++) { 
                if (updatedForum[i].id == id) { 
                    updatedForum.splice(i, 1)
                }
            }
            console.log(updatedForum)
            console.log("Writing data to Firebase, change: " + change)
            rootRef.set({"classData": classState, "forumData": updatedForum, "userData": userState})
            console.log("Succesfully wrote data")
            window.location.reload()
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

    const commentSection = comments.map(comment => {
        let user = ""
        let commentContent = ""
        for (const [u, c] of Object.entries(comment)) {
            user = u
            commentContent = c
        }
        return(
            <div>
                <p><b>{user}</b></p>
                <p>{commentContent}</p>
                <br/>
            </div>
        )
    })

    return (
        <div>
            <div className="forum">
                <div className="forum-post">
                    <div className="post-header">
                        <Link to={'/class/' + classId} style={linkStyle}>
                            <p align="left">from <u>{className}</u></p>
                        </Link>
                    </div>
                    <div className="post-like"> 
                        <label align="right">
                            <input 
                                type="checkbox" 
                                checked={liked[id]} 
                                onChange={handleChange}
                                align="right"
                            />
                        <b>{numLikes} {(numLikes == 1) ? "like" : "likes"}</b></label>
                    </div> 
                    <div className="post-title">
                        <h2 className="post-title">{title}</h2>
                    </div>
                    
                    <div className="post-text">
                        <p>{text}</p>
                    </div> 
                    <div className="post-footer">
                        <p>Posted by <i>{creatorDisplayName} - {month} / {day} / {year}</i></p>
                        <p>{numComments} {(numComments == 1) ? "comment" : "comments"}</p>
                            {(mod || (creatorId == userId)) && <p onClick = {handleDelete} style={linkStyle}><u>Delete</u></p>}
                    </div>
                </div>
            </div>
            <div className="comment-input">
                <form>
                    <textarea name="comment" id="comment" className="comment-textarea" onChange={handleChange} placeholder="Comment here"></textarea>    
                </form>
                <button onClick={handleSubmit} className="comment-button"><span>Comment </span></button>
            </div>    
            <div className="comment-section">
                {commentSection}
            </div>
        </div>
    )
}

export default ForumDetail