import React from 'react'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import * as regularIcons from '@fortawesome/free-regular-svg-icons'

function ForumPost(props) {
    const id = props.post.id
    const liked = props.liked
    const title = props.post.title
    const text = props.post.text
    const date = new Date(JSON.parse(props.post.date))
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
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
            <div className="post-header">
                <Link to={'/class/' + classId} style={linkStyle}>
                    from <u>{className}</u>
                </Link>
                <label align="right">
                    <input 
                        type="checkbox" 
                        checked={liked} 
                        onChange={() => props.handleChange(id)}
                        align="right"
                    />
                <b>{liked ? <FontAwesomeIcon icon={solidIcons.faHeart}/> : <FontAwesomeIcon icon={regularIcons.faHeart}/>} {numLikes}</b></label>
            </div>
            <Link to={'/post/' + id} style={linkStyle}>  
                <div className="post-title">
                    <h2>{title}</h2>
                </div>
                <div className="post-text-short">
                    {text}
                </div> 
                <div className="post-footer">
                    <div>Posted by <i>{creatorDisplayName} - {month} / {day} / {year}</i></div>
                    <div>{numComments} {(numComments === 1) ? "comment" : "comments"}</div>      
                </div>
            </Link>
            <div className="post-hr">
                <hr />
            </div>
        </div>
    )
}

export default ForumPost