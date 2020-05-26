import React, {useContext} from 'react'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import logo from '../Images/TaskFloat_Logo_White.png'

function Nav() {
    const {currentUser} = useContext(AuthContext)
    const profilePic = currentUser.photoURL
    return (
        <nav>
            <Link to={'/'} className="nav-logo">
                <img src={logo} className="logo"/>
                <h1>TaskFloat</h1>
            </Link>
            <ul className="nav-links">
                <Link to={'/post'} className="nav-link" data-tip="Add new post" data-offset="{'bottom': -6}">
                    <li><FontAwesomeIcon className="nav-icon" icon={solidIcons.faPlus}/></li>
                </Link>
                <ReactTooltip effect="solid" delayShow={500} scrollHide={false}/>

                <Link to={'/chat'} className="nav-link" data-tip="Chat" data-offset="{'bottom': -6}">
                    <li><FontAwesomeIcon className="nav-icon" icon={solidIcons.faComment}/></li>
                </Link>
                <ReactTooltip effect="solid" delayShow={500} scrollHide={false}/>

                <Link to={'/class'} className="nav-link" data-tip="Classes" data-offset="{'bottom': -6}">
                    <li><FontAwesomeIcon className="nav-icon" icon={solidIcons.faUsers}/></li>
                </Link>
                <ReactTooltip effect="solid" delayShow={500} scrollHide={false}/>
                <a href="https://forms.gle/MZRy6D3pqP4K95gZ8" className="nav-link" data-tip="Report bugs" data-offset="{'bottom': -6}">
                    <li><FontAwesomeIcon className="nav-icon" icon={solidIcons.faBug}/></li>
                </a>
                <ReactTooltip effect="solid" delayShow={500} scrollHide={false}/>
                <Link to={'/profile'} className="nav-link" data-tip="Profile" data-offset="{'bottom': -6}">
                    <li><img src={profilePic} alt="Profile Picture" className="nav-img"/></li>
                </Link>
                <ReactTooltip effect="solid" delayShow={500} scrollHide={false}/>
            </ul>
        </nav>
    )
}

export default Nav