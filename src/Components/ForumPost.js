import React from 'react'
import {Link} from 'react-router-dom'

function ForumPost(props) {
    const id = props.post.id
    const liked = props.liked
    const title = props.post.title
    const text = props.post.text
    const date = new Date(props.post.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const creatorId = props.post.creatorId
    const creatorDisplayName = props.post.creatorDisplayName
    const numLikes = props.post.likes.length
    const numComments = props.post.comments.length
    const className = props.post.class
    const classId = props.post.classId

    const linkStyle = {
        color: "black",
        textDecoration: "none"
    }

    return (
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
                        checked={liked} 
                        onChange={() => props.handleChange(id)}
                        align="right"
                    />
                <b>{numLikes} {(numLikes == 1) ? "like" : "likes"}</b></label>
            </div>
            <Link to={'/post/' + id} style={linkStyle}>  
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
            </Link>
            <hr />  
        </div>
    )
}

export default ForumPost