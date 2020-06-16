import React, {useContext, useState} from 'react'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'

function Nav() {
    const {currentUser} = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    const userId = currentUser.uid
    const profilePic = currentUser.photoURL
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    function DropdownMenu(props) {
        return(
            <div className={props.cName}>
                <Link to={'/user/' + userId} className="nav-dropdown-item" onClick={() => {setOpen(false)}}>
                    <img src={profilePic} alt="Profile Picture" className="nav-img" style={{marginRight: "10px"}}/>
                    Profile
                </Link>
                <Link to="/settings" className="nav-dropdown-item" onClick={() => {setOpen(false)}}>
                    <FontAwesomeIcon className="nav-dropdown-item-icon" icon={solidIcons.faCog}/>
                    Settings
                </Link>
                <hr/>
                <Link to={'/invite'} className="nav-dropdown-item" onClick={() => {setOpen(false)}}>
                    <FontAwesomeIcon className="nav-dropdown-item-icon" icon={solidIcons.faUserPlus}/>
                    Invite friends
                </Link>
                <a href="https://forms.gle/MZRy6D3pqP4K95gZ8" className="nav-dropdown-item" target="_blank" onClick={() => {setOpen(false)}}>
                    <FontAwesomeIcon className="nav-dropdown-item-icon" className="nav-dropdown-item-icon" icon={solidIcons.faBug}/>
                    Give feedback
                </a>
            </div>
        )
    }

    return (
        <div>
            <nav>
                <div className="nav">
                    <Link to={'/'} className="nav-name" onClick={() => {setOpen(false)}}>
                        <h1>floatr</h1>
                    </Link>
                    <ul className="nav-icons">
                        <Link to={'/post'} className="nav-icon" data-tip="Add new post" data-offset="{'bottom': -6}" onClick={() => {setOpen(false)}}>
                            <li><FontAwesomeIcon icon={solidIcons.faPlus}/></li>
                        </Link>

                        <Link to={'/chat'} className="nav-icon" data-tip="Chat" data-offset="{'bottom': -6}" onClick={() => {setOpen(false)}}>
                            <li><FontAwesomeIcon icon={solidIcons.faComment}/></li>
                        </Link>

                        <Link to={'/class'} className="nav-icon" data-tip="Classes" data-offset="{'bottom': -6}" onClick={() => {setOpen(false)}}>
                            <li><FontAwesomeIcon icon={solidIcons.faUsers}/></li>
                        </Link>

                        <li className="nav-dropdown-icon" onClick={() => {setOpen(!open)}}>
                            <img src={profilePic} alt="Profile Picture" className="nav-img" style={{marginRight: "10px"}}/>
                            <FontAwesomeIcon icon={solidIcons.faAngleDown}/>
                        </li>

                        {open && <DropdownMenu cName="nav-dropdown"/>}
                        
                        <ReactTooltip effect="solid" delayShow={500} scrollHide={false} disable={isMobile}/>
                    </ul>
                </div>
                <div className="mobile-nav-top">
                    <Link to={'/'} className="nav-name" onClick={() => {setOpen(false)}}>
                        <h1>floatr</h1>
                    </Link>
                    <div className="mobile-nav-dropdown-icon" onClick={() => {setOpen(!open)}}>
                        <FontAwesomeIcon icon={solidIcons.faAngleDown}/>
                        {open && <DropdownMenu cName="mobile-nav-dropdown"/>}
                    </div>
                </div>
                <div className="mobile-nav-bottom">
                    <ul className="nav-icons">
                        <Link to={'/'} className="nav-icon" onClick={() => {setOpen(false)}}>
                            <li><FontAwesomeIcon icon={solidIcons.faHome}/></li>
                        </Link>

                        <Link to={'/chat'} className="nav-icon" onClick={() => {setOpen(false)}}>
                            <li><FontAwesomeIcon icon={solidIcons.faComment}/></li>
                        </Link>

                        <Link to={'/post'} className="nav-icon" onClick={() => {setOpen(false)}}>
                            <li><FontAwesomeIcon icon={solidIcons.faPlus}/></li>
                        </Link>

                        <Link to={'/class'} className="nav-icon" onClick={() => {setOpen(false)}}>
                            <li><FontAwesomeIcon icon={solidIcons.faUsers}/></li>
                        </Link>

                        <Link to={'/user/' + userId} className="nav-icon" onClick={() => {setOpen(false)}}>
                            <li><img src={profilePic} alt="Profile Picture" className="nav-img"/></li>
                        </Link>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Nav