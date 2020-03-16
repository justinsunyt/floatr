import React, {useState, useEffect} from 'react'
import * as firebase from 'firebase'
import ForumPost from './ForumPost'
const username = "Justin"

function Forum() {
    const forumRef = firebase.database().ref()
    const [forumState, setForumState] = useState([])
    // initialize forumState

    let liked = forumState.map(post => (post.likes.includes(username)) ? true : false)
    // initialize liked array for checkbox prop
    console.log("Liked:")
    console.log(liked)

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
        }  
    }

    function handleChange(id) {
        let change = ""
        setForumState(prevForum => {
            const updatedForum = prevForum.map(post => {
                let newPost = post
                if (post.id === id) {
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

    const forum = forumState.map((post, index) => <ForumPost key={post.id} post={post} handleChange={handleChange} liked={liked[index]}/>)
  
    return(
        <div className='forum'>
            {forum}
        </div>
    )
}

export default Forum