import React, {useState, useEffect, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import Forum from './Forum'
import {Link, Redirect} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as solidIcons from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function UserDetail({match}) {
    const userRef = firebase.firestore().collection("users").doc(match.params.id)
    const [userState, setUserState] = useState({})
    const [userInitiated, setUserInitiated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid

    useEffect(() => {
        setLoaded(false)
        setLoading(true)
        userRef.get().then(doc => {
            if ((doc.exists && match.params.id === userId) || (doc.exists && match.params.id !== userId)) {
                setUserInitiated(true)
                console.log("Fetched from users")
                let newUserState = doc.data()
                newUserState.id = doc.id
                setUserState(newUserState)
                setLoading(false)
                setLoaded(true)
            } else if (!doc.exists && match.params.id !== userId) {
                alert("This user does not exist!")
            } else {
                setLoading(false)
            }
        }).catch(err => {
            console.log("Error: ", err)
        })
    }, [match.params.id])

    if (loading) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>   
        )
    } else if (!userInitiated) {
        return <Redirect to="settings"/>
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="profile-header">
                        {(userState.id === userId) && 
                            <div>
                                <Link to="/settings" data-tip="Settings" data-offset="{'bottom': 3}"><FontAwesomeIcon className="profile-settings" icon={solidIcons.faCog}/></Link>
                                <ReactTooltip effect="solid" delayShow={500} scrollHide={false} place="bottom"/>
                            </div>
                        }
                    </div>
                    <div className="profile-details">
                        <img src={userState.profilePic} alt="Profile Picture" className="profile-pic"/>
                        <div className="profile-text">
                            <h1>{userState.displayName}</h1>
                            {userState.mod && <h5><i>Moderator</i></h5>}
                            {userState.bio}
                        </div>
                    </div>
                    <div>
                        <Forum filter={`user/${userState.id}`} />
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default UserDetail