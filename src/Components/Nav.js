import React from 'react'
import {Link} from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import logo from '../Images/TaskFloat_Logo_White.png'

function Nav() {
    return (
        <nav>
            <Link to={'/'} className="nav-logo">
                <img src={logo} className="logo"/>
                <h1>TaskFloat</h1>
            </Link>
            <ul className="nav-links">
                <Link to={'/post'} className="nav-link" data-tip="Add new post" data-offset="{'bottom': -6}">
                    <li><FontAwesomeIcon icon={solidIcons.faPlus}/></li>
                </Link>
                <ReactTooltip effect="solid" delayShow="500" scrollHide={false}/>

                <Link to={'/chat'} className="nav-link" data-tip="Chat" data-offset="{'bottom': -6}">
                    <li><FontAwesomeIcon icon={solidIcons.faComment}/></li>
                </Link>
                <ReactTooltip effect="solid" delayShow="500"/>

                <Link to={'/class'} className="nav-link" data-tip="Classes" data-offset="{'bottom': -6}">
                    <li><FontAwesomeIcon icon={solidIcons.faUsers}/></li>
                </Link>
                <ReactTooltip effect="solid" delayShow="500"/>

                <Link to={'/profile'} className="nav-link" data-tip="Profile" data-offset="{'bottom': -6}">
                    <li><FontAwesomeIcon icon={solidIcons.faUser}/></li>
                </Link>
                <ReactTooltip effect="solid" delayShow="500"/>
            </ul>
        </nav>
    )
}

export default Nav