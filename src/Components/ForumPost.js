import React from 'react'

function ForumPost(props) {
    const likes = props.post.likes
    const title = props.post.title
    const text = props.post.text
    const year = props.post.date.getFullYear()
    const month = props.post.date.getMonth()
    const day = props.post.date.getDate()
    const creator = props.post.creator
    const numComments = Object.keys(props.post.comments).length
    const className = props.post.class

    return (
        <div className="forum-post">
            <div className="forum-header">
                <p align="left">from {className}</p>
                <p align="right"><b>{likes} {(likes == 1) ? "like" : "likes"}</b></p>
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
            <hr />  
        </div>
    )
}

export default ForumPost