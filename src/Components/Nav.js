import React from 'react'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'

function Nav() {
    const logoStyle = {
        color: "white",
        textDecoration: "none"
    }

    return (
        <nav>
            <Link to={'/'} style={logoStyle}>
                <h1>TaskFloat</h1>
            </Link>
            <ul className="nav-links">
                <Link to={'/post'} className="nav-link">
                    <li><FontAwesomeIcon icon={solidIcons.faPlus}/> <span className="nav-text">Post</span></li>
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