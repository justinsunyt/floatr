import React, {useContext} from 'react'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'

function Nav() {
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const profilePic = currentUser.photoURL
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    return (
        <div>
            <div className="mobile-nav">
                <Link to={'/'} className="mobile-nav-name">
                    <h1>floatr</h1>
                </Link>
            </div>
            <nav>
                <Link to={'/'} className="nav-name">
                    <h1>floatr</h1>
                </Link>
                <ul className="nav-links">
                    <Link to={'/post'} className="nav-link" data-tip="Add new post" data-offset="{'bottom': -6}">
                        <li><FontAwesomeIcon icon={solidIcons.faPlus}/></li>
                    </Link>

                    <Link to={'/chat'} className="nav-link" data-tip="Chat" data-offset="{'bottom': -6}">
                        <li><FontAwesomeIcon icon={solidIcons.faComment}/></li>
                    </Link>

                    <Link to={'/class'} className="nav-link" data-tip="Classes" data-offset="{'bottom': -6}">
                        <li><FontAwesomeIcon icon={solidIcons.faUsers}/></li>
                    </Link>

                    <a href="https://forms.gle/MZRy6D3pqP4K95gZ8" className="nav-link" data-tip="Report bugs" data-offset="{'bottom': -6}">
                        <li><FontAwesomeIcon icon={solidIcons.faBug}/></li>
                    </a>

                    <Link to={'/user/' + userId} className="nav-link" data-tip="Profile" data-offset="{'bottom': -6}">
                        <li><img src={profilePic} alt="Profile Picture" className="nav-img"/></li>
                    </Link>
                    
                    <ReactTooltip effect="solid" delayShow={500} scrollHide={false} disable={isMobile}/>
                </ul>
            </nav>
        </div>
    )
}

export default Nav