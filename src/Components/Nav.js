import React from 'react'
import {Link} from 'react-router-dom'

function Nav() {
    const logoStyle = {
        color: "black",
        textDecoration: "none"
    }

    const linkStyle = {
        color: "#2d3758",
        textDecoration: "none"
    }

    return (
        <nav>
            <Link to={'/'} style={logoStyle}>
                <h1>TaskFloat</h1>
            </Link>
            <ul className="nav-links">
                <Link to={'/post'} style={linkStyle}>
                    <li>Post</li>
                </Link>
                <Link to={'/class'} style={linkStyle}>
                    <li>Classes</li>
                </Link>
                <Link to={'/profile'} style={linkStyle}>
                    <li>Profile</li>
                </Link>
            </ul>
        </nav>
    )
}

export default Nav