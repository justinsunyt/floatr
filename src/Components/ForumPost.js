import React from 'react'
import {Link} from 'react-router-dom'

function ForumPost(props) {
    const id = props.post.id
    const liked = props.liked
    const title = props.post.title
    const text = props.post.text
    const date = new Date(props.post.date)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const creator = props.post.creator
    const numLikes = props.post.likes.length
    const numComments = Object.keys(props.post.comments).length
    const className = props.post.class

    const linkStyle = {
        color: 'black',
        textDecoration: 'none'
    }

    return (
        <div className="forum-post">
            <div className="forum-header">
                <p align="left">from {className}</p>
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
            <div className="forum-title">
                <Link to={'/post/'+ id} style={linkStyle}>  
                    <h2 className="forum-title">{title}</h2>
                </Link>
            </div>
            
            <div className="forum-text">
                <Link to={'/post/'+ id} style={linkStyle}>
                    <p>{text}</p>
                </Link>
            </div> 
            <div className="forum-footer">
                <p>Posted by <i>{creator} - {month} / {day} / {year}</i></p>
                <Link to={'/post/'+ id} style={linkStyle}>
                    <p>{numComments} {(numComments == 1) ? "comment" : "comments"}</p>
                </Link>
            </div>
            <hr />  
        </div>
    )
}

export default ForumPost