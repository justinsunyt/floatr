import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase/app'
import {firestore} from '../firebase'
import ForumPost from './ForumPost'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Forum(props) {
    const filter = props.filter
    const classesRef = firestore.collection("classes")
    const forumRef = firestore.collection("forum")
    const [forumState, setForumState] = useState([])
    const [querySize, setQuerySize] = useState(10)
    const [queryLimit, setQueryLimit] = useState(false)
    const [classIds, setClassIds] = useState([])
    const [atBottom, setAtBottom] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [liked, setLiked] = useState([])
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userDisplayName = currentUser.displayName
    const userProfilePic = currentUser.photoURL
    const today = firebase.firestore.FieldValue.serverTimestamp()

    function handleForumSnap(snap) {
        let newForum = []
        snap.forEach(post => {
            const postData = post.data()
            postData.id = post.id
            newForum.push(postData)
        })
        if (forumState.length === newForum.length) {
            setQueryLimit(true)
        }
        setForumState(newForum)
        setLiked(newForum.map(post => (post.likes.includes(userId)) ? true : false))
        setLoading(false)
        setLoaded(true)
    }

    function handleChange(id) {
        const postRef = forumRef.doc(id)
        let newForumState = [...forumState]
        newForumState.forEach(post => {
            if (post.id === id) {
                if (post.likes.includes(userId)) {
                    post.likes.forEach((like, index) => {
                        if (like === userId) {
                            post.likes.splice(index, 1)
                        }
                    })
                } else {
                    post.likes.push(userId)
                }
                postRef.set(post)
            }
        })
        setForumState(newForumState)
        setLiked(newForumState.map(post => (post.likes.includes(userId)) ? true : false))
    }

    function handleSubmit(event) {
        event.preventDefault()
        const {id} = event.target
        const input = event.target.querySelector("input")
        const postRef = forumRef.doc(id)
        const commentsRef = postRef.collection("comments")
        let newForumState = [...forumState]
        newForumState.forEach(post => {
            if (post.id === id) {
                let newComment = {}
                newComment.creatorId = userId
                newComment.creatorDisplayName = userDisplayName
                newComment.creatorProfilePic = userProfilePic
                newComment.date = today
                newComment.text = input.value
                newComment.reports = []
                commentsRef.add(newComment)
                postRef.update({numComments: firebase.firestore.FieldValue.increment(1)})
                post.numComments ++
                input.value = ""
            }
        })
        setForumState(newForumState)
    }

    function handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
            setAtBottom(true)
        } else {
            setAtBottom(false)
        }
    }

    useEffect(() => {
        classesRef.where("students", "array-contains", userId)
        .get().then(snap => {
            let classes = []
            snap.forEach(doc => {
                classes.push(doc.id)
            })
            setClassIds(classes)
            if (filter.slice(0, 6) === "class/") {
                forumRef.where("classId", "==", filter.slice(6)).orderBy("date", "desc").limit(querySize)
                .get().then(snap => {
                    handleForumSnap(snap)
                }).catch(err => {
                    console.log("Error: ", err)
                })
            } else if (filter.slice(0, 5) === "user/"){
                forumRef.where("creatorId", "==", filter.slice(5)).orderBy("date", "desc").limit(querySize)
                .get().then(snap => {
                    handleForumSnap(snap)
                }).catch(err => {
                    console.log("Error: ", err)
                })
            } else {
                if (classes.length !== 0) {
                    forumRef.where("classId", "in", classes).orderBy("date", "desc").limit(querySize)
                    .get().then(snap => {
                        handleForumSnap(snap)
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                } else {
                    setLoading(false)
                    setLoaded(true)
                }
            }
        }).catch(err => {
            console.log("Error: ", err)
        })

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        if (atBottom) {
            if (!queryLimit) {
                const newQuery = querySize + 10
                if (filter.slice(0, 6) === "class/") {
                    forumRef.where("classId", "==", filter.slice(6)).orderBy("date", "desc").limit(newQuery)
                    .get().then(snap => {
                        handleForumSnap(snap)
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                } else if (filter.slice(0, 5) === "user/"){
                    forumRef.where("creatorId", "==", filter.slice(5)).orderBy("date", "desc").limit(newQuery)
                    .get().then(snap => {
                        handleForumSnap(snap)
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                } else {
                    if (classIds.length !== 0) {
                        forumRef.where("classId", "in", classIds).orderBy("date", "desc").limit(newQuery)
                        .get().then(snap => {
                            handleForumSnap(snap)
                        }).catch(err => {
                            console.log("Error: ", err)
                        })
                    } else {
                        setLoading(false)
                        setLoaded(true)
                    }
                }
                setQuerySize(newQuery)
            }
        }
    }, [atBottom])

    const forum = forumState.map((post, index) => {
        return(
            <div className="forum">
                <ForumPost key={post.id} post={post} handleChange={handleChange} handleSubmit={handleSubmit} liked={liked[index]}/>
            </div>
        ) 
    })

    if (loading) {
        return (
            <div className="loading-large">
                <ReactLoading type="balls" color="#ff502f" width="100%" delay={1000}/>
            </div>
        )
    } else {
        if (classIds.length === 0) {
            return (
                <CSSTransition in={loaded} timeout={300} classNames="fade">
                    <div>
                        <div className="forum-header">
                            <h3>You haven't joined any classes yet!</h3> 
                        </div>
                        <div className="forum-header">
                            <Link to="/joinclass"><button className="short-button width-150"><span>Join class </span></button></Link>
                        </div>
                    </div>
                </CSSTransition>
            )
        } else if (forumState.length === 0) {
            return (
                <CSSTransition in={loaded} timeout={300} classNames="fade">
                    <div>
                        <div className='forum-header'>
                            <Link to={'/post'} className="post-link">
                                <button className="long-button">Add new post</button>
                            </Link>
                        </div>
                        <div className="forum-header">
                            <h3>Post something :)</h3>
                        </div>
                    </div>
                </CSSTransition>
            )
        } else {
            return (
                <CSSTransition in={loaded} timeout={300} classNames="fade">
                    <div>
                        {(filter.slice(5) === userId || filter.slice(0, 6) === "class/" || filter === "dashboard") && 
                            <div className='forum-header'>
                                <Link to={'/post'} className="post-link">
                                    <button className="long-button">Add new post</button>
                                </Link>
                            </div>
                        }
                        {forum}
                    </div>
                </CSSTransition>
            )
        }
    }
}

export default Forum