import React from 'react'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import * as regularIcons from '@fortawesome/free-regular-svg-icons'
import * as firebase from 'firebase'

function ForumPost(props) {
    const storageRef = firebase.storage().ref()
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
    const img = props.post.img

    const linkStyle = {
        color: "black",
        textDecoration: "none"
    }

    if (img) {
        storageRef.child(`forumData/images/${id}`).getDownloadURL().then(url => {
            const image = document.getElementById("img" + id)
            image.src = url
        })
    }

    return (
        <div className="forum-post">
            <div className="post-header">
                <Link to={'/class/' + classId} style={linkStyle}>
                    from <u>{className}</u>
                </Link>
                <label align="right" className="like-button">
                    <input 
                        type="checkbox" 
                        checked={liked} 
                        onChange={() => props.handleChange(id)}
                        align="right"
                        className="like-checkbox"
                    />
                <b>{liked ? <FontAwesomeIcon icon={solidIcons.faHeart} color="#ff502f"/> : <FontAwesomeIcon icon={regularIcons.faHeart}/>} {numLikes}</b></label>
            </div>
            <Link to={'/post/' + id} style={linkStyle}>  
                <div className="post-title">
                    <h2>{title}</h2>
                </div>
                <div className="post-text-short">
                    {text}
                </div>
                {img && 
                    <div>
                        <img id={"img" + id} className="post-image"/> 
                    </div>
                }
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