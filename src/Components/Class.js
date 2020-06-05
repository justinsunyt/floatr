import React, {useEffect, useState, useContext} from 'react'
import {firestore} from 'firebase/app'
import {AuthContext} from '../Auth'
import {Link, Redirect} from 'react-router-dom'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Class() {
    const classesRef = firestore().collection("classes")
    const {currentUser} = useContext(AuthContext)
    const [classesState, setClassesState] = useState([{students: []}])
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [userInitiated, setUserInitiated] = useState(false)
    const userId = currentUser.uid
    const userRef = firestore().collection("users").doc(userId)

    function handleClassesSnap(snap) {
        let classes = []
        snap.forEach(doc => {
            let cl = {}
            cl = doc.data()
            cl.id = doc.id
            classes.push(cl)
        })
        setClassesState(classes)
        setLoading(false)
        setLoaded(true)
    }
    
    useEffect(() => {
        userRef.get().then(doc => {
            if (doc.exists) {
                setUserInitiated(true)
                classesRef.where("students", "array-contains", userId).orderBy("name")
                .get().then(snap => {
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

    const classList = classesState.map(cl => {
        return (
            <div>
                <div className="class-item">
                    <Link to={'/class/' + cl.id} style={linkStyle}>
                        <h3>{cl.name}</h3>
                        <div className="class-footer">
                            {cl.students.length > 0 && cl.students.length + ((cl.students.length === 1) ? " student" : " students")}
                        </div>
                    </Link>   
                </div>
                <div className="post-hr">
                    <hr />
                </div>
            </div>
        )
    })

    if (loading) {
        return (
            <div className="loading-large">
                <ReactLoading type="balls" color="#ff502f" width="100%" delay={1000}/>
            </div>   
        )
    } else if (!userInitiated) {
        return <Redirect to="settings"/>
    } else {
        if (classesState.length === 0) {
            return (
                <CSSTransition in={loaded} timeout={300} classNames="fade">
                    <div>
                        <div className="forum-header">
                            <h3>You haven't joined any classes yet!</h3> 
                        </div>
                        <div className="forum-header">
                            <Link to="/joinclass"><button className="short-button width-150"><span>Join class </span></button></Link>
                        </div>
                    </div>
                </CSSTransition>
            )
        } else {
            return (
                <CSSTransition in={loaded} timeout={300} classNames="fade">
                    <div>
                        <div className="class-header">
                            <h1>Classes</h1>
                        </div>
                        <div>
                            <div className='forum-header'>
                                    <Link to={'/joinclass'} className="post-link">
                                        <button className="long-button">Join new classes</button>
                                    </Link>
                                </div>
                            <div className="forum">
                                {classList}
                            </div>
                        </div>
                    </div>
                </CSSTransition>
            )
        }
    }
}

export default Class