import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import ForumPost from './ForumPost'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'
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
    const [loaded, setLoaded] = useState(false)
    const [liked, setLiked] = useState([])
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid

    let classes = []

    function handleForumSnap(snap) {
        let filteredForum = []
        snap.forEach(post => {
            const postData = post.data()
            postData.id = post.id
            filteredForum.push(postData)
        })
        filteredForum = filteredForum.filter(post => { 
            if (classIds.includes(post.classId) || classes.includes(post.classId)) {
                return post
            }
        })
        if (forumState.length === filteredForum.length) {
            setQueryLimit(true)
        }
        setForumState(filteredForum)
        setLiked(filteredForum.map(post => (post.likes.includes(userId)) ? true : false))
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
        classesRef.where("students", "array-contains", userId)
        .get().then(snap => {
            console.log("Fetched from classes")
            snap.forEach(doc => {
                classes.push(doc.id)
            })
            setClassIds(classes)
        }).catch(err => {
            console.log("Error: ", err)
        })

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
            forumRef.orderBy("date", "desc").limit(querySize)
            .get().then(snap => {
                console.log("Fetched from forum")
                handleForumSnap(snap)
            }).catch(err => {
                console.log("Error: ", err)
            })
        }
        console.log("Filter: ", filter)
        console.log("Query size: ", querySize)

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

    if (!loaded) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>
        )
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    {(filter === userId && forumState.length === 0) ? 
                        <div>
                            <div className='forum-header'>
                                    <Link to={'/post'} className="post-link">
                                        <button className="post-button">Add new post</button>
                                    </Link>
                                </div>
                        </div>
                    :
                        (!Array.isArray(classIds) || !classIds.length) ? 
                            <div className="class-list">
                                <p>You haven't joined any classes yet!</p>
                                <Link to="/joinclass"><button className="joinclass-button"><span>Join class </span></button></Link>
                            </div>
                        :
                            <div>
                                <div className='forum-header'>
                                    <Link to={'/post'} className="post-link">
                                        <button className="post-button">Add new post</button>
                                    </Link>
                                </div>
                                <div className='forum'>
                                    {forum}
                                </div>
                            </div>
                    }
                </div>
            </CSSTransition>
        )
    }
}

export default Forum