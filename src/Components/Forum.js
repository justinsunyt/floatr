import React, {useState} from 'react'
import ForumPost from './ForumPost'
import forumData from '../Api/forumData'

function Forum() {
    const [forumPosts, setForum] = useState(forumData)

    const forum = forumPosts.map(post => <ForumPost key={post.id} post={post}/>)

    return(
        <div className='forum'>
            {forum}
        </div>
    )
}

export default Forum