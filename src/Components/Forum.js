import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import ForumPost from './ForumPost'
import {AuthContext} from '../Auth'
import {Link, Redirect} from 'react-router-dom'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Forum(props) {
    const filter = props.filter
    const classesRef = firebase.firestore().collection("classes")
    const forumRef = firebase.firestore().collection("forum")
    const [forumState, setForumState] = useState([])
    const [querySize, setQuerySize] = useState(10)
    const [queryLimit, setQueryLimit] = useState(false)
    const [classIds, setClassIds] = useState([])
    const [atBottom, setAtBottom] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [liked, setLiked] = useState([])
    const [userInitiated, setUserInitiated] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const userRef = firebase.firestore().collection("users").doc(userId)

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
        let newForumState = forumState
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
                console.log("Wrote to post")
            }
        })
        setForumState(newForumState)
        setLiked(newForumState.map(post => (post.likes.includes(userId)) ? true : false))
    }

    function handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
            setAtBottom(true)
        } else {
            setAtBottom(false)
        }
    }

    useEffect(() => {
        userRef.get().then(doc => {
            if (doc.exists) {
                setUserInitiated(true)
                classesRef.where("students", "array-contains", userId)
                .get().then(snap => {
                    console.log("Fetched from classes")
                    let classes = []
                    snap.forEach(doc => {
                        classes.push(doc.id)
                    })
                    setClassIds(classes)
                    if (filter.slice(0, 6) === "class/") {
                        forumRef.where("classId", "==", filter.slice(6)).orderBy("date", "desc").limit(querySize)
                        .get().then(snap => {
                            console.log("Fetched from forum")
                            handleForumSnap(snap)
                        }).catch(err => {
                            console.log("Error: ", err)
                        })
                    } else if (filter.slice(0, 5) === "user/"){
                        forumRef.where("creatorId", "==", filter.slice(5)).orderBy("date", "desc").limit(querySize)
                        .get().then(snap => {
                            console.log("Fetched from forum")
                            handleForumSnap(snap)
                        }).catch(err => {
                            console.log("Error: ", err)
                        })
                    } else {
                        forumRef.where("classId", "in", classes).orderBy("date", "desc").limit(querySize)
                        .get().then(snap => {
                            console.log("Fetched from forum")
                            handleForumSnap(snap)
                        }).catch(err => {
                            console.log("Error: ", err)
                        })
                    }
                    console.log("Filter: ", filter)
                    console.log("Query size: ", querySize)
                }).catch(err => {
                    console.log("Error: ", err)
                })
            } else {
                setLoading(false)
            }
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
                        console.log("Fetched from forum")
                        handleForumSnap(snap)
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                } else if (filter.slice(0, 5) === "user/"){
                    forumRef.where("creatorId", "==", filter.slice(5)).orderBy("date", "desc").limit(newQuery)
                    .get().then(snap => {
                        console.log("Fetched from forum")
                        handleForumSnap(snap)
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                } else {
                    forumRef.orderBy("date", "desc").limit(newQuery)
                    .get().then(snap => {
                        console.log("Fetched from forum")
                        handleForumSnap(snap)
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                }
                console.log("Query size: ", newQuery)
                setQuerySize(newQuery)
            }
        }
    }, [atBottom])

    const forum = forumState.map((post, index) => <ForumPost key={post.id} post={post} handleChange={handleChange} liked={liked[index]}/>)

    if (loading) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>
        )
    } else if (!userInitiated) {
        return <Redirect to="/settings"/>
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    {(classIds.length === 0) ? 
                        <div>
                            <div className="forum-header">
                                <p>You haven't joined any classes yet!</p> 
                            </div>
                            <div className="forum-header">
                                <Link to="/joinclass"><button className="joinclass-button"><span>Join class </span></button></Link>
                            </div>
                        </div>
                    : 
                    ((forumState.length === 0) ?
                        <div>
                            <div className='forum-header'>
                                <Link to={'/post'} className="post-link">
                                    <button className="post-button">Add new post</button>
                                </Link>
                            </div>
                        </div>
                        :
                        <div>
                            {(filter.slice(5) === userId || filter.slice(0, 6) === "class/" || filter === "dashboard") && 
                                <div className='forum-header'>
                                    <Link to={'/post'} className="post-link">
                                        <button className="post-button">Add new post</button>
                                    </Link>
                                </div>
                            }
                            <div className='forum'>
                                {forum}
                            </div>
                        </div>
                    )}
                </div>
            </CSSTransition>
        )
    }
}

export default Forum