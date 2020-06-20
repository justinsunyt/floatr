import React, {useContext, useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import * as firebase from 'firebase/app'
import {auth} from '../firebase'
import {AuthContext} from '../Auth'
import ReactLoading from 'react-loading'
import Ocean from '../Images/Background/Ocean.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'

function Login() {
    const provider = new firebase.auth.GoogleAuthProvider()
    const [loading, setLoading] = useState(false)
    const {currentUser} = useContext(AuthContext)

    function handleLogin() {
        setLoading(true)
        auth.signInWithPopup(provider).then(() => {
            setLoading(false)
        }).catch(error => {
            console.log(error)
        })
    }

    if (loading) {
        return (
            <div className="loading-large">
                <ReactLoading type="balls" color="#ff502f" width="100%" delay={1000}/>
            </div>
        )
    } else if (currentUser) {
        return <Redirect to="/" />
    } else {
        return(
            <div>
                <div className="login-intro-container">
                    <img className="login-intro-background" src={Ocean}/>
                    <svg id="login-logo" width="427" height="138" viewBox="0 0 427 138" fill="none" xmlns="http://www.w3.org/2000/svg" perserveaspectratio="true">
                        <path d="M16.9995 134V56.51L6.91946 55.34C5.59946 55.04 4.54945 54.59 3.76945 53.99C2.98945 53.33 2.59946 52.4 2.59946 51.2V44.63H16.9995V39.77C16.9995 34.73 17.7495 29.96 19.2495 25.46C20.8095 20.9 23.1495 16.94 26.2695 13.58C29.3895 10.22 33.2895 7.55 37.9695 5.57C42.6495 3.59 48.1095 2.60001 54.3495 2.60001C58.9695 2.60001 63.4095 2.78 67.6694 3.14C71.9895 3.5 76.1595 3.71 80.1795 3.77H91.0695V134H75.1395V15.02C71.8995 14.9 68.6295 14.75 65.3295 14.57C62.0895 14.39 59.2395 14.3 56.7795 14.3C48.9795 14.3 42.9795 16.55 38.7795 21.05C34.6395 25.49 32.5695 31.73 32.5695 39.77V44.63H56.2395V56.24H33.0195V134H16.9995Z" stroke="white" strokeWidth="5" strokeLinecap="square"/>
                        <path d="M155.481 41.39C162.141 41.39 168.141 42.5 173.481 44.72C178.821 46.94 183.381 50.09 187.161 54.17C190.941 58.25 193.821 63.2 195.801 69.02C197.841 74.78 198.861 81.23 198.861 88.37C198.861 95.57 197.841 102.05 195.801 107.81C193.821 113.57 190.941 118.49 187.161 122.57C183.381 126.65 178.821 129.8 173.481 132.02C168.141 134.18 162.141 135.26 155.481 135.26C148.761 135.26 142.701 134.18 137.301 132.02C131.961 129.8 127.401 126.65 123.621 122.57C119.841 118.49 116.931 113.57 114.891 107.81C112.911 102.05 111.921 95.57 111.921 88.37C111.921 81.23 112.911 74.78 114.891 69.02C116.931 63.2 119.841 58.25 123.621 54.17C127.401 50.09 131.961 46.94 137.301 44.72C142.701 42.5 148.761 41.39 155.481 41.39ZM155.481 122.75C164.481 122.75 171.201 119.75 175.641 113.75C180.081 107.69 182.301 99.26 182.301 88.46C182.301 77.6 180.081 69.14 175.641 63.08C171.201 57.02 164.481 53.99 155.481 53.99C150.921 53.99 146.931 54.77 143.511 56.33C140.151 57.89 137.331 60.14 135.051 63.08C132.831 66.02 131.151 69.65 130.011 73.97C128.931 78.23 128.391 83.06 128.391 88.46C128.391 99.26 130.611 107.69 135.051 113.75C139.551 119.75 146.361 122.75 155.481 122.75Z" stroke="white" strokeWidth="5" strokeLinecap="square"/>
                        <path d="M268.59 92.96C261.21 93.2 254.91 93.8 249.69 94.76C244.53 95.66 240.3 96.86 237 98.36C233.76 99.86 231.39 101.63 229.89 103.67C228.45 105.71 227.73 107.99 227.73 110.51C227.73 112.91 228.12 114.98 228.9 116.72C229.68 118.46 230.73 119.9 232.05 121.04C233.43 122.12 235.02 122.93 236.82 123.47C238.68 123.95 240.66 124.19 242.76 124.19C245.58 124.19 248.16 123.92 250.5 123.38C252.84 122.78 255.03 121.94 257.07 120.86C259.17 119.78 261.15 118.49 263.01 116.99C264.93 115.49 266.79 113.78 268.59 111.86V92.96ZM216.84 55.7C221.88 50.84 227.31 47.21 233.13 44.81C238.95 42.41 245.4 41.21 252.48 41.21C257.58 41.21 262.11 42.05 266.07 43.73C270.03 45.41 273.36 47.75 276.06 50.75C278.76 53.75 280.8 57.38 282.18 61.64C283.56 65.9 284.25 70.58 284.25 75.68V134H277.14C275.58 134 274.38 133.76 273.54 133.28C272.7 132.74 272.04 131.72 271.56 130.22L269.76 121.58C267.36 123.8 265.02 125.78 262.74 127.52C260.46 129.2 258.06 130.64 255.54 131.84C253.02 132.98 250.32 133.85 247.44 134.45C244.62 135.11 241.47 135.44 237.99 135.44C234.45 135.44 231.12 134.96 228 134C224.88 132.98 222.15 131.48 219.81 129.5C217.53 127.52 215.7 125.03 214.32 122.03C213 118.97 212.34 115.37 212.34 111.23C212.34 107.63 213.33 104.18 215.31 100.88C217.29 97.52 220.5 94.55 224.94 91.97C229.38 89.39 235.17 87.29 242.31 85.67C249.45 83.99 258.21 83.03 268.59 82.79V75.68C268.59 68.6 267.06 63.26 264 59.66C260.94 56 256.47 54.17 250.59 54.17C246.63 54.17 243.3 54.68 240.6 55.7C237.96 56.66 235.65 57.77 233.67 59.03C231.75 60.23 230.07 61.34 228.63 62.36C227.25 63.32 225.87 63.8 224.49 63.8C223.41 63.8 222.48 63.53 221.7 62.99C220.92 62.39 220.26 61.67 219.72 60.83L216.84 55.7Z" stroke="white" strokeWidth="5" strokeLinecap="square"/>
                        <path d="M335.412 135.44C328.212 135.44 322.662 133.43 318.762 129.41C314.922 125.39 313.002 119.6 313.002 112.04V56.24H302.022C301.062 56.24 300.252 55.97 299.592 55.43C298.932 54.83 298.602 53.93 298.602 52.73V46.34L313.542 44.45L317.232 16.28C317.412 15.38 317.802 14.66 318.402 14.12C319.062 13.52 319.902 13.22 320.922 13.22H329.022V44.63H355.392V56.24H329.022V110.96C329.022 114.8 329.952 117.65 331.812 119.51C333.672 121.37 336.072 122.3 339.012 122.3C340.692 122.3 342.132 122.09 343.332 121.67C344.592 121.19 345.672 120.68 346.572 120.14C347.472 119.6 348.222 119.12 348.822 118.7C349.482 118.22 350.052 117.98 350.532 117.98C351.372 117.98 352.122 118.49 352.782 119.51L357.462 127.16C354.702 129.74 351.372 131.78 347.472 133.28C343.572 134.72 339.552 135.44 335.412 135.44Z" stroke="white" strokeWidth="5" strokeLinecap="square"/>
                        <path d="M387.144 61.1C390.024 54.86 393.564 50 397.764 46.52C401.964 42.98 407.094 41.21 413.154 41.21C415.074 41.21 416.904 41.42 418.644 41.84C420.444 42.26 422.034 42.92 423.414 43.82L422.244 55.79C421.884 57.29 420.984 58.04 419.544 58.04C418.704 58.04 417.474 57.86 415.854 57.5C414.234 57.14 412.404 56.96 410.364 56.96C407.484 56.96 404.904 57.38 402.624 58.22C400.404 59.06 398.394 60.32 396.594 62C394.854 63.62 393.264 65.66 391.824 68.12C390.444 70.52 389.184 73.28 388.044 76.4V134H371.934V42.83H381.114C382.854 42.83 384.054 43.16 384.714 43.82C385.374 44.48 385.824 45.62 386.064 47.24L387.144 61.1Z" stroke="white" strokeWidth="5" strokeLinecap="square"/>
                    </svg>
                    <button className="short-button login-button" onClick={handleLogin}><span>Login </span></button>
                    <FontAwesomeIcon className="login-angle-down" icon={solidIcons.faAngleDown} size={"3x"}/>
                </div>
                <div className="login-description-container">
                    <div className="login-description">
                        <h1>What is <span style={{color: "#0055ff"}}>floatr</span>?</h1>
                        <p>floatr is a student-made social platform for made by Harvard-Westlake students for students of HW. Our mission is to create student-driven communities that are a <span style={{color: "#ff502f"}}>safe space</span> for all without school affiliation.</p>
                    </div>
                    <div className="login-description">
                        <h1><span style={{color: "#0055ff"}}>Students</span> First</h1>
                        <p>As students ourselves, we designed the platform to be student driven. Each school community will be maintained by student administrators to foster a <span style={{color: "#ff502f"}}>private and positive</span> environment.</p>
                    </div>
                    <div className="login-description">
                        <h1>Access Codes</h1>
                        <p>Currently, floatr is only limited to students of <span style={{color: "#ff502f"}}>Harvard-Westlake</span>. To restrict access, access codes are given through email invites to people with HW student emails. However, you are welcome to use any Google account to login to floatr.</p>
                    </div>
                </div>
                <div className="login-join-container" onClick={handleLogin}>
                    <div className="login-join">
                        <div style={{textAlign: "left", maxWidth: "350px", marginRight: "50px"}}>
                            <h1>Join floatr</h1>
                            <p>Login with your Google account if you have received an invite code.</p>
                        </div>
                        <FontAwesomeIcon icon={solidIcons.faAngleRight} size={"3x"}/>
                    </div>
                </div>
                <a style={{color: "white", textDecoration: "none"}} href="https://forms.gle/BuBwcRdJQ9VK4eYj8" target="_blank">
                    <div className="login-apply-container">
                        <div className="login-apply">
                            <FontAwesomeIcon icon={solidIcons.faAngleLeft} size={"3x"}/>
                            <div style={{textAlign: "right", maxWidth: "350px", marginLeft: "50px"}}>
                                <h1>Join the watchlist</h1>
                                <p>Apply for the watchlist if your school is not invovlved yet.</p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        )
    }
}
export default Login