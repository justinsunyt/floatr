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
    
    function updateForumData(data) {
        for (let value of Object.values(data)) {
            forumData = value
        }
        forumData.shift()
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
                        newPost.likes.push(username)
                    }
                }
                return newPost
            })
            return updatedForum
        })
        console.log(forumPosts)  
    }

    useEffect(() => {
        forumRef.once("value")
        .then(snap => {
            updateForumData(snap.val()) 
            console.log(snap.val())
        })
        
    }, [])

    useEffect(() => {
        liked = forumPosts.map(post => (post.likes.includes(username)) ? true : false)
        console.log(liked)
    }, [forumPosts])

    const forum = forumPosts.map((post, index) => <ForumPost key={post.id} post={post} handleChange={handleChange} liked={liked[index]}/>)
  
    return(
        <div className='forum'>
            {forum}
        </div>
    )
}

export default Forum