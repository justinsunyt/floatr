import React, {useState, useEffect} from 'react'
import * as firebase from 'firebase'
import ForumPost from './ForumPost'
// import forumData from '../Api/forumData'
const username = "Justin"

function Forum() {
    const forumRef = firebase.database().ref()
    let forumData = []
    
    const [forumPosts, setForum] = useState(forumData)
    let liked = forumPosts.map(post => (post.likes.includes(username)) ? true : false)
    
    function fetchForumData(data) {
        for (let value of Object.values(data)) {
            forumData = value
        }
        console.log(forumData)
        setForum(forumData)
    }

    function handleChange(id) {
        setForum(prevForum => {
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
                    } else {
                        if (!newPost.likes) {
                            newPost.likes = []
                        }
                        newPost.likes.push(username)
                    }
                }
                return newPost
            })
            forumRef.set({"forumData": updatedForum})
            return updatedForum
        })
        console.log(forumPosts)
        liked = forumPosts.map(post => (post.likes.includes(username)) ? true : false)
        
    }

    useEffect(() => {
        forumRef.once("value")
        .then(snap => {
            fetchForumData(snap.val()) 
            console.log(snap.val())
        })
    }, [])

    const forum = forumPosts.map((post, index) => <ForumPost key={post.id} post={post} handleChange={handleChange} liked={liked[index]}/>)
  
    return(
        <div className='forum'>
            {forum}
        </div>
    )
}

export default Forum