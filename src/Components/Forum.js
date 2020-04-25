import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import ForumPost from './ForumPost'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Forum(props) {
    const filter = props.filter
    const rootRef = firebase.database().ref()
    const forumRef = firebase.database().ref("forumData")
    const userRef = firebase.database().ref("userData")
    const [forumState, setForumState] = useState([])
    const [filteredState, setFilteredState] = useState([])
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const [classIds, setClassIds] = useState([])
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)

    let liked = filteredState.map(post => (post.likes.includes(userId)) ? true : false)
    let classes = []
    // initialize liked array for checkbox prop
    console.log("Liked:")
    console.log(liked)

    function fetchData(data) {
        for (let [key, value] of Object.entries(data)) {
            if (key === "classData") {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["students"].includes(userId)) {
                        classes.push(value[i]["id"])
                    }
                }
                setClassIds(classes)
            }
            if (key === "forumData") {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["comments"] === undefined){
                        value[i]["comments"] = []
                    }
                    // initialize "comments" if undefined
                    if (value[i]["likes"] === undefined){
                        value[i]["likes"] = []
                    }
                    // initialize "likes" if undefined
                }
                setForumState(value)
                let filteredForum = value
                if (typeof filter === "number") {
                   filteredForum = value.filter(val => {
                       if (val["classId"] === filter) {
                           return val
                       }
                   })     
                }
                else if (filter === userId){
                    filteredForum = value.filter(val => {
                        if (val["creatorId"] === userId) {
                            return val
                        }
                    })
                }
                else
                {
                    filteredForum = value.filter(val => {
                        if (classes.includes(val["classId"])) {
                            return val
                        }
                    })
                }
                filteredForum.sort((a, b) => {
                    const d1 = new Date(JSON.parse(a.date))
                    const d2 = new Date(JSON.parse(b.date))
                    return (d2 - d1)
                })
                setFilteredState(filteredForum)
            }
            if (key === "userData") {
                let includesUser = false
                for (let i = 0; i < value.length; i++) {
                    if (value[i].id === userId) {
                        includesUser = true
                    }
                }
                let newUserData = value
                if (!includesUser) {
                    newUserData.push({
                        "id": userId,
                        "mod": false
                    })
                }
                // initialize userData for user if undefined
                userRef.set(newUserData)
            }
        }
        setLoading(false)
        setLoaded(true)
    }

    function handleChange(id) {
        let change = ""
        setForumState(prevForum => {
            const updatedForum = prevForum.map(post => {
                let newPost = post
                if (post.id === id) {
                    if (post.likes.includes(userId)) {
                        const filteredLikes = post.likes.filter(value => {
                            if (value !== userId) {
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
                return newPost
            })
            console.log("Writing data to Firebase, change: " + change)
            forumRef.set(updatedForum)
            console.log("Succesfully wrote data")
            return updatedForum
        })
        console.log("New state:")
        console.log(forumState)
    }

    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
        // fetch forum data when component mounts
    }, [])

    const forum = filteredState.map((post, index) => <ForumPost key={post.id} post={post} handleChange={handleChange} liked={liked[index]}/>)

    if (loading) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>
        )
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    {(filter === userId && filteredState.length === 0) ? 
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