import React from 'react'

function ForumPost(props) {
    const likes = props.post.likes
    const title = props.post.title
    const text = props.post.text
    const year = props.post.date.getFullYear()
    const month = props.post.date.getMonth()
    const day = props.post.date.getDate()

    return (
        <div className="forum-post">
            <div className="forum-title">
                <h2 className="forum-title">{title}</h2>
                <p align="right"><b>{likes} likes</b></p>
            </div>
            
            <div className="forum-text">
                <p>{text}</p>
            </div> 
            <div className="forum-date">
                <p><i>{month} / {day} / {year}</i></p>
            </div>  
        </div>
    )
}

export default ForumPost