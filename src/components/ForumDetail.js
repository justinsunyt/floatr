import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase/app'
import {firestore, storage} from '../firebase'
import {Link, Redirect} from 'react-router-dom'
import {AuthContext} from '../Auth'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import * as regularIcons from '@fortawesome/free-regular-svg-icons'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function ForumDetail({match}) {
    const postRef = firestore.collection("forum").doc(match.params.id)
    const commentsRef = postRef.collection("comments")
    const userRef = firestore.collection("users")
    const storageRef = storage.ref()
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
    const [redirect, setRedirect] = useState(false)
    const [src, setSrc] = useState("")
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName
    const userProfilePic = currentUser.photoURL
    const today = firebase.firestore.FieldValue.serverTimestamp()
    const todayDate = new Date()

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

    function handlePostDoc(doc) {
        setPostState(doc.data())
        if (doc.data().likes.includes(userId)) {
            setLiked(true)
        }
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
            setPostState(newPostState)
        }
        else if (type === "text") {
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
            newComment.creatorProfilePic = userProfilePic
            newComment.date = today
            newComment.text = commentState
            newComment.reports = []
            commentsRef.add(newComment)
            postRef.update({numComments: firebase.firestore.FieldValue.increment(1)})
            setCommentState("")
        }
    }

    function handleDeletePost() {
        if (window.confirm("Are you sure you want to delete this post?\nThis action is irreversible")) {
            commentsRef.get().then(comments => {
                comments.forEach(comment => {
                    comment.ref.delete()
                })
                postRef.delete().then(() => {
                    if (img) {
                        storageRef.child(`forum/images/${match.params.id}`).delete().then(() => {}).catch(err => alert(err))
                    }
                }).catch(err => {
                    console.log("Error: ", err)
                }) 
            }).catch(err => {
                console.log("Error: ", err)
            })  
        }
    }

    function handleDeleteComment(commentId) {
        if (window.confirm("Are you sure you want to delete this comment?\nThis action is irreversible")) {
            commentsRef.doc(commentId).delete().then(() => {
                postRef.update({numComments: firebase.firestore.FieldValue.increment(-1)})
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
                handlePostDoc(doc)
                if (doc.data().img) {
                    storageRef.child(`forum/images/${match.params.id}`).getDownloadURL().then(url => {
                        setSrc(url)
                        setLoading(false)
                        setLoaded(true)
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                } else {
                    setLoading(false)
                    setLoaded(true)
                }
            } else {
                alert("This post has been deleted")
                setRedirect(true)
            }
        })
        const unsubscribeComments = commentsRef.orderBy("date", "desc").onSnapshot(snap => {
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
        const creatorProfilePic = comment.creatorProfilePic
        const text = comment.text
        const date = comment.date ? comment.date.toDate() : todayDate
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const commentReports = comment.reports.length

        return(
            <div key={commentId}>
                <div className="comment-content">
                    <Link to={"/user/" + creatorId}><img className="comment-img" src={creatorProfilePic}></img></Link>
                    <div className="comment-text" data-tip={mod && (commentReports + ((commentReports === 1) ? " report" : " reports"))}>
                        <div><b>{creatorDisplayName}</b> {date && <span>- {month} / {day} / {year}</span>}</div>
                        {text}
                    </div>
                    {mod && <ReactTooltip effect="solid" delayShow={500} scrollHide={false}/>}
                    <div className="comment-btns">
                        <div onClick = {() => handleReportComment(commentId)} style={linkStyle}>
                            {comment.reports.includes(userId) ? <FontAwesomeIcon icon={solidIcons.faFlag}/> : <FontAwesomeIcon icon={regularIcons.faFlag}/>}
                        </div>
                        <div onClick = {() => handleDeleteComment(commentId)} style={linkStyle}>
                            {(mod || (creatorId === userId)) && <FontAwesomeIcon icon={regularIcons.faTrashAlt}/>}
                        </div>       
                    </div>
                </div>
            </div>
        )
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
                <div>
                    <div className="forum">
                        <div className="forum-post">
                            <div className="post-header">
                                <Link to={'/class/' + classId} style={linkStyle}>
                                    from <u>{className}</u>
                                </Link>
                                <label align="right" className="like-button-label">
                                    <input
                                        type="checkbox" 
                                        checked={liked} 
                                        onChange={handleChange}
                                        className="like-checkbox"
                                    />
                                <b><div className="like-button">{liked ? <FontAwesomeIcon icon={solidIcons.faHeart} color="#ff502f"/> : <FontAwesomeIcon icon={regularIcons.faHeart}/>} {numLikes}</div></b></label>
                            </div>
                            <div className="post-title">
                                <h2 className="post-title">{title}</h2>
                            </div>   
                            <div className="post-text-long">
                                {text}
                            </div>
                            {img && (!loaded ? 
                                <div className="forum-header">
                                    <ReactLoading type="bars" color="black" width="10%"/>
                                </div>
                            : 
                                <div>
                                    <img src={src} className="post-image"/> 
                                </div>)
                            } 
                            <div className="post-footer">
                                <div>Posted by <Link to={'/user/' + creatorId} style={linkStyle}><u>{creatorDisplayName}</u></Link> - {month} / {day} / {year}</div>
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
                        <div className="post-hr">
                            <hr />
                        </div>
                        <div className="comment-input">
                            <form onSubmit={handleSubmit}>
                                <input type="text" onChange={handleChange} placeholder="Comment here" value={commentState} maxLength="1000" required></input>
                                <div className="character-count">{commentState.length} / 1000 characters</div>
                            </form>
                        </div>
                        <div className="comment-section">
                            {commentSection}
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default ForumDetail