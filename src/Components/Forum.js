import React, {useState, useEffect} from 'react'
import * as firebase from 'firebase'
import ForumPost from './ForumPost'
// import forumData from '../Api/forumData'
const username = "Justin"

function Forum() {
    const rootRef = firebase.database().ref("taskfloat")
    const forumRef = rootRef.child("forumData")
    let forumData = []
    forumRef.once("value")
        .then(snap => {
            snap.forEach(childSnap => {
                let child = {}
                let childKey
                let childVal
                childSnap.forEach(grandChildSnap => {
                    childKey = grandChildSnap.key
                    childVal = grandChildSnap.val()
                    child[childKey] = childVal
                    console.log(childKey, childVal)
                })
                console.log(child)
                forumData.push(child)
            })
        })
    
    const [forumPosts, setForum] = useState(forumData)
    let liked = forumPosts.map(post => (post.likes.includes(username)) ? true : false)

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
        liked = forumPosts.map(post => (post.likes.includes(username)) ? true : false)
        console.log(liked)
    })

    const forum = forumPosts.map((post, index) => <ForumPost key={post.id} post={post} handleChange={handleChange}/>)
  
    return(
        <div className='forum'>
            {forum}
        </div>
    )
}

export default Forum