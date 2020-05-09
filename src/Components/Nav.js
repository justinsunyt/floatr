import React from 'react'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import logo from '../Images/TaskFloat_Logo_Transparent.png'

function Nav() {
    return (
        <nav>
            <Link to={'/'} className="nav-logo">
                <img src={logo} className="logo"/>
                <h1>TaskFloat</h1>
            </Link>
            <ul className="nav-links">
                <Link to={'/post'} className="nav-link">
                    <li><FontAwesomeIcon icon={solidIcons.faPlus}/> <span className="nav-text">Post</span></li>
                </Link>
                <Link to={'/todo'} className="nav-link">
                    <li><FontAwesomeIcon icon={solidIcons.faList}/> <span className="nav-text">Todo</span></li>
                </Link>
                <Link to={'/chat'} className="nav-link">
                    <li><FontAwesomeIcon icon={solidIcons.faComment}/> <span className="nav-text">Chat</span></li>
                </Link>
                <Link to={'/class'} className="nav-link">
                    <li><FontAwesomeIcon icon={solidIcons.faUsers}/> <span className="nav-text">Classes</span></li>
                </Link>
                <Link to={'/profile'} className="nav-link">
                    <li><FontAwesomeIcon icon={solidIcons.faUser}/> <span className="nav-text">Profile</span></li>
                </Link>
            </ul>
        </nav>
    )
}

export default Nav