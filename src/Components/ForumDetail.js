import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {Link} from 'react-router-dom'
import {AuthContext} from '../Auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import * as regularIcons from '@fortawesome/free-regular-svg-icons'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function ForumDetail({match}) {
    const postRef = firebase.firestore().collection("forum").doc(match.params.id)
    const commentsRef = postRef.collection("comments")
    const userRef = firebase.firestore().collection("users")
    const storageRef = firebase.storage().ref()
    const [id, setId] = useState(match.params.id)
    const [postState, setPostState] = useState({
        "class" : "",
        "classId" : "",
        "creatorId" : "",
        "creatorDisplayName" : "",
        "date" : null,
        "numComments" : 0,
        "id" : "",
        "likes" : [],
        "text" : "",
        "title" : "",
        "reports" : [],
        "img": false
    })
    const [commentsState, setCommentsState] = useState([])
    const [commentState, setCommentState] = useState("")
    const [mod, setMod] = useState(false)
    const [liked, setLiked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName
    const today = firebase.firestore.Timestamp.now()

    let title = postState.title
    let text = postState.text
    let date = postState.date && postState.date.toDate()
    let year = date && date.getFullYear()
    let month = date && date.getMonth() + 1
    let day = date && date.getDate()
    let creatorId = postState.creatorId
    let creatorDisplayName = postState.creatorDisplayName
    let numLikes = postState.likes.length
    let numComments = postState.numComments
    let className = postState.class
    let classId = postState.classId
    let reports = postState.reports
    let numReports = postState.reports.length
    let img = postState.img

    const linkStyle = {
        color: "black",
        textDecoration: "none",
        cursor: "pointer"
    }

    if (img) {
        storageRef.child(`forum/images/${id}`).getDownloadURL().then(url => {
            const image = document.getElementById("img" + id)
            if (url) {
                image.src = url
            }
        }).catch(err => {
            console.log("Error: ", err)
        })
    }

    function handlePostDoc(doc) {
        setPostState(doc.data())
        if (doc.data().likes.includes(userId)) {
            setLiked(true)
        }
        setLoading(false)
        setLoaded(true)
    }

    function handleCommentsSnap(snap) {
        let comments = []
        snap.forEach(comment => {
            const commentData = comment.data()
            commentData.id = comment.id
            comments.push(commentData)
        })
        setCommentsState(comments)
    }

    function handleChange(event) {
        const {value, type} = event.target
        if (type === "checkbox") {
            let newPostState = postState
            if (newPostState.likes.includes(userId)) {
                newPostState.likes.forEach((like, index) => {
                    if (like === userId) {
                        newPostState.likes.splice(index, 1)
                    }
                })
                setLiked(false)
            } else {
                newPostState.likes.push(userId)
                setLiked(true)
            }
            postRef.set(newPostState)
            console.log("Wrote to post")
            setPostState(newPostState)
        }
        else if (type === "textarea") {
            setCommentState(value)
        }
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (commentState === "") {
            alert("You cannot comment nothing")
        } else {
            let newComment = {}
            newComment.creatorId = userId
            newComment.creatorDisplayName = userDisplayName
            newComment.date = today
            newComment.text = commentState
            newComment.reports = []
            commentsRef.add(newComment)
            console.log("Wrote to comments")
            document.getElementById("comment").value = ""
            setCommentState("")
        }
    }

    function handleDeletePost() {
        if (window.confirm("Are you sure you want to delete this post?\nThis action is irreversible")) {
            postRef.delete().then(() => {
                console.log("Deleted post")
                if (img) {
                    storageRef.child(`forum/images/${id}`).delete().then(() => {}).catch(error => alert(error))
                }
                window.location.reload()
            }).catch(err => {
                console.log("Error: ", err)
            })
        }
    }

    function handleDeleteComment(commentId) {
        if (window.confirm("Are you sure you want to delete this comment?\nThis action is irreversible")) {
            commentsRef.doc(commentId).delete().then(() => {
                console.log("Deleted comment")
            }).catch(err => {
                console.log("Error: ", err)
            })
        }
    }

    function handleReportPost() {
        if (reports.includes(userId)) {
            alert("You have already reported this post")
        } else {
            if (window.confirm("Are you sure you want to report this post?\nThis action is irreversible")) {
                let newPostState = postState
                newPostState.reports.push(userId)
                postRef.set(newPostState)
                console.log("Wrote to post")
                setPostState(newPostState)
            }
        }
    }

    function handleReportComment(commentId) {
        let newCommentsState = commentsState
        for (const comment of newCommentsState) {
            if (comment.id === commentId) {
                if (comment.reports.includes(userId)) {
                    alert("You have already reported this comment")
                } else {
                    if (window.confirm("Are you sure you want to report this comment?\nThis action is irreversible")) {
                        comment.reports.push(userId)
                        commentsRef.doc(commentId).set(comment)
                        console.log("Wrote to comments")
                        setCommentsState(newCommentsState)
                    }
                }
            }
        }
    }

    useEffect(() => {
        userRef.doc(userId).get().then(doc => {
            setMod(doc.data().mod)
        })
        const unsubscribePost = postRef.onSnapshot(doc => {
            if (doc.exists) {
                console.log("Fetched from post")
                handlePostDoc(doc)
            } else {
                alert("This post has been deleted")
            }
        })
        const unsubscribeComments = commentsRef.orderBy("date", "desc").onSnapshot(snap => {
            console.log("Fetched from comments")
            handleCommentsSnap(snap)
        })
        return () => {
            unsubscribePost()
            unsubscribeComments()
        }
        // fetch data when database updates
    }, [])

    const commentSection = commentsState.map(comment => {
        const commentId = comment.id
        const creatorId = comment.creatorId
        const creatorDisplayName = comment.creatorDisplayName
        const text = comment.text
        const date = comment.date.toDate()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const commentReports = comment.reports.length

        return(
            <div>
                <p><b>{creatorDisplayName}</b> - {month} / {day} / {year}</p>
                <p>{text}</p>
                <div className="post-footer-btns">
                    <div className="post-report" onClick = {() => handleReportComment(commentId)} style={linkStyle}>
                    {comment.reports.includes(userId) ? <FontAwesomeIcon icon={solidIcons.faFlag}/> : <FontAwesomeIcon icon={regularIcons.faFlag}/>}
                    </div>
                    <div className="post-delete" onClick = {() => handleDeleteComment(commentId)} style={linkStyle}>
                        {(mod || (creatorId === userId)) && <FontAwesomeIcon icon={regularIcons.faTrashAlt}/>}
                    </div>        
                </div>
                <div style={{marginTop: "10px", color: "#888888"}}>
                    {mod && (commentReports + ((commentReports === 1) ? " report" : " reports"))}
                </div> 
                <br/>
            </div>
        )
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
                <div>
                    <div className="forum">
                        <div className="forum-post">
                            <div className="post-header">
                                <Link to={'/class/' + classId} style={linkStyle}>
                                    from <u>{className}</u>
                                </Link>
                                <label align="right" className="like-button">
                                    <input 
                                        type="checkbox" 
                                        checked={liked} 
                                        onChange={handleChange}
                                        align="right"
                                        className="like-checkbox"
                                    />
                                <b>{liked ? <FontAwesomeIcon icon={solidIcons.faHeart} color="#ff502f"/> : <FontAwesomeIcon icon={regularIcons.faHeart}/>} {numLikes}</b></label>
                            </div>
                            <div className="post-title">
                                <h2 className="post-title">{title}</h2>
                            </div>   
                            <div className="post-text-long">
                                {text}
                            </div>
                            {img && 
                                <div>
                                    <img id={"img" + id} className="post-image"/> 
                                </div>
                            } 
                            <div className="post-footer">
                                <div>Posted by <u>{creatorDisplayName}</u> - {month} / {day} / {year}</div>
                                <div>{numComments} {(numComments === 1) ? "comment" : "comments"}</div>
                                <div style={{color: "#888888"}}>{mod && (numReports + ((numReports === 1) ? " report" : " reports"))}</div>  
                            </div>
                            <div className="post-footer-btns">
                                <div className="post-report" onClick = {handleReportPost} style={linkStyle}>
                                    {reports.includes(userId) ? <FontAwesomeIcon icon={solidIcons.faFlag}/> : <FontAwesomeIcon icon={regularIcons.faFlag}/>}
                                </div>
                                <div className="post-delete" onClick = {handleDeletePost} style={linkStyle}>
                                    {(mod || (creatorId === userId)) && <FontAwesomeIcon icon={regularIcons.faTrashAlt}/>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="comment-input">
                        <form onSubmit={handleSubmit}>
                            <textarea name="comment" id="comment" className="comment-textarea" onChange={handleChange} placeholder="Comment here" required></textarea>  
                            <button className="comment-button"><span>Comment </span></button>
                        </form>
                    </div>    
                    <div className="comment-section">
                        {commentSection}
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default ForumDetail