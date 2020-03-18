import React, {useState, useEffect} from 'react'
import * as firebase from 'firebase'
const username = 'Justin'

function ForumDetail({match}) {
    const forumRef = firebase.database().ref()
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
    const [id, setId] = useState(0)

    let liked = forumState.map(post => (post.likes.includes(username)) ? true : false)

    let title = forumState[id].title
    let text = forumState[id].text
    let date = new Date (forumState[id].date)
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let creator = forumState[id].creator
    let numLikes = forumState[id].likes.length
    let numComments = Object.keys(forumState[id].comments).length
    let className = forumState[id].class

    function fetchForumData(data) {
        for (let value of Object.values(data)) {
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
    }

    function handleChange() {
        let change = ""
        setForumState(prevForum => {
            const updatedForum = prevForum.map(post => {
                let newPost = post
                if (post.id == id) {
                    if (post.likes.includes(username)) {
                        const filteredLikes = post.likes.filter(value => {
                            if (value != username) {
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
                        newPost.likes.push(username)
                        change = "liked post"
                        // if post is unliked, like post
                    }
                }
                console.log(newPost)
                return newPost
            })
            console.log("Writing data to Firebase, change: " + change)
            forumRef.set({"forumData": updatedForum})
            console.log("Succesfully wrote data")
            return updatedForum
        })
        console.log("New state:")
        console.log(forumState)
    }

    useEffect(() => {
        forumRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchForumData(snap.val())
        })
        // fetch forum data when component mounts 
    }, [])

    return (
        <div className="forum">
            <div className="forum-post">
                <div className="forum-header">
                    <p align="left">from {className}</p>
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
                    <p>Posted by <i>{creator} - {month} / {day} / {year}</i></p>
                    <p>{numComments} {(numComments == 1) ? "comment" : "comments"}</p>
                </div> 
            </div>
        </div>
    )
}

export default ForumDetail