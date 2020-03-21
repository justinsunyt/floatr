import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {Link} from 'react-router-dom'
import {AuthContext} from '../Auth'

function ForumDetail({match}) {
    const rootRef = firebase.database().ref()
    const [forumState, setForumState] = useState([{
        "class" : "",
        "comments" : {},
        "creator" : "",
        "date" : "",
        "id" : 0,
        "likes" : [],
        "text" : "",
        "title" : ""
    }])
    const [classState, setClassState] = useState([])
    const [id, setId] = useState(0)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid

    let liked = forumState.map(post => (post.likes.includes(userId)) ? true : false)

    let title = forumState[id].title
    let text = forumState[id].text
    let date = new Date (forumState[id].date)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let creatorDisplayName = forumState[id].creatorDisplayName
    let numLikes = forumState[id].likes.length
    let numComments = Object.keys(forumState[id].comments).length
    let className = forumState[id].class
    let classId = forumState[id].classId

    const linkStyle = {
        color: "black",
        textDecoration: "none"
    }

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter == 0) {
                setClassState(value)
            }
            if (counter == 1) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["comments"] === undefined){
                        value[i]["comments"] = {}
                    }
                    // initialize "comments" if undefined
                    if (value[i]["likes"] === undefined){
                        value[i]["likes"] = []
                    }
                    // initialize "likes" if undefined
                }
                setForumState(value)
                setId(match.params.id)
            }
            counter ++
        }
    }

    function handleChange() {
        let change = ""
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
            rootRef.set({"classData": classState, "forumData": updatedForum})
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

    return (
        <div className="forum">
            <div className="forum-post">
                <div className="forum-header">
                    <Link to={'/class/' + classId} style={linkStyle}>
                        <p align="left">from <u>{className}</u></p>
                    </Link>
                </div>
                <div className="forum-like"> 
                    <label align="right">
                        <input 
                            type="checkbox" 
                            checked={liked[id]} 
                            onChange={() => handleChange()}
                            align="right"
                        />
                    <b>{numLikes} {(numLikes == 1) ? "like" : "likes"}</b></label>
                </div> 
                <div className="forum-title">
                    <h2 className="forum-title">{title}</h2>
                </div>
                
                <div className="forum-text">
                    <p>{text}</p>
                </div> 
                <div className="forum-footer">
                    <p>Posted by <i>{creatorDisplayName} - {month} / {day} / {year}</i></p>
                    <p>{numComments} {(numComments == 1) ? "comment" : "comments"}</p>
                </div> 
            </div>
        </div>
    )
}

export default ForumDetail