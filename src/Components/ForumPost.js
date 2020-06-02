import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import ReactLoading from 'react-loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import * as regularIcons from '@fortawesome/free-regular-svg-icons'
import {storage} from 'firebase/app'

function ForumPost(props) {
    const storageRef = storage().ref()
    const [loaded, setLoaded] = useState(false)
    const [src, setSrc] = useState("")
    const id = props.post.id
    const liked = props.liked
    const title = props.post.title
    const text = props.post.text
    const date = props.post.date.toDate()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const creatorId = props.post.creatorId
    const creatorDisplayName = props.post.creatorDisplayName
    const numLikes = props.post.likes.length
    const numComments = props.post.numComments
    const className = props.post.class
    const classId = props.post.classId
    const img = props.post.img

    const linkStyle = {
        color: "black",
        textDecoration: "none"
    }

    useEffect(() => {
        if (img) {
            storageRef.child(`forum/images/${id}`).getDownloadURL().then(url => {
                setSrc(url)
                setLoaded(true)
            }).catch(err => {
                console.log("Error: ", err)
            })
        }
    }, [])

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
                {img && (!loaded ? 
                    <div className="loading-small">
                        <ReactLoading type="balls" color="#ff502f" width="100%" delay={1000} delay={1000}/>
                    </div>
                : 
                    <div>
                        <img id={"img" + id} src={src} className="post-image"/> 
                    </div>)
                }
                <div className="post-footer">
                    <div>Posted by <Link to={'/user/' + creatorId} style={linkStyle}><u>{creatorDisplayName}</u></Link> - {month} / {day} / {year}</div>
                    <div>{numComments} {(numComments === 1) ? "comment" : "comments"}</div>      
                </div>
            </Link>
            <div className="post-hr">
                <hr />
            </div>
            <div className="comment-input">
                <form id={id} onSubmit={props.handleSubmit}>
                    <input type="text" placeholder="Comment here" maxLength="1000" required></input>
                </form>
            </div>
        </div>
    )
}

export default ForumPost