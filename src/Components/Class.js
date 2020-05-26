import React, {useEffect, useState, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import {Link, Redirect} from 'react-router-dom'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Class() {
    const classesRef = firebase.firestore().collection("classes")
    const {currentUser} = useContext(AuthContext)
    const [classState, setClassState] = useState([])
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [userInitiated, setUserInitiated] = useState(false)
    const userId = currentUser.uid
    const userRef = firebase.firestore().collection("users").doc(userId)

    function handleClassesSnap(snap) {
        let classes = []
        snap.forEach(doc => {
            let cl = {}
            cl = doc.data()
            cl.id = doc.id
            classes.push(cl)
        })
        setClassState(classes)
        setLoading(false)
        setLoaded(true)
    }
    
    useEffect(() => {
        userRef.get().then(doc => {
            if (doc.exists) {
                setUserInitiated(true)
                classesRef.where("students", "array-contains", userId)
                .get().then(snap => {
                    console.log("Fetched from classes")
                    handleClassesSnap(snap)
                }).catch(err => {
                    console.log("Error: ", err)
                })
            } else {
                setLoading(false)
            }
        })
    }, [])

    const linkStyle = {
        color: "black",
        textDecoration: "none"
    }

    const classList = classState.map(cl => {
        return (
            <Link to={'/class/' + cl.id} style={linkStyle}>
                <p>{cl.name}</p>
            </Link>
        )
    })

    if (loading) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>   
        )
    } else if (!userInitiated) {
        return <Redirect to="settings"/>
    } else {
        return (
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="class-header">
                        <h1>Classes</h1>
                        <Link to="/joinclass">
                            <button className="joinclass-button"><span>Join class </span></button>
                        </Link>
                    </div>
                    <div className="class-list">
                        {classList}
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Class