import React, {useEffect, useState, useContext} from 'react'
import {firestore} from 'firebase/app'
import {AuthContext} from '../Auth'
import {Redirect} from 'react-router-dom'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function JoinClass() {
    const classesRef = firestore().collection("classes")
    const {currentUser} = useContext(AuthContext)
    const [classState, setClassState] = useState([])
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const userId = currentUser.uid
    const userRef = firestore().collection("users").doc(userId)

    let checked = classState.map(cl => (cl.students.includes(userId)) ? true : false)
    
    function handleClassesSnap(snap) {
        let classes = []
        let joinedClasses = []
        snap.forEach(doc => {
            console.log(doc.data())
            let cl = {}
            cl = doc.data()
            cl.id = doc.id
            if (!cl.students.includes(userId)) {
                classes.push(cl)
            } else {
                joinedClasses.push(cl)
            }
        })
        if (joinedClasses.length > 0) {
            userRef.update({userStage: 2})
        }
        setClassState(classes)
        setLoading(false)
        setLoaded(true)
    }

    function handleChange(id) {
        let newClasses = classState
        newClasses = newClasses.map(cl => {
            let newClass = cl
            if (cl.id === id) {
                if (cl.students.includes(userId)) {
                    const filteredStudents = cl.students.filter(value => {
                        if (value !== userId) {
                            return value
                        }
                    })
                    newClass.students = filteredStudents
                } else {
                    newClass.students.push(userId)
                }
            }
            return newClass
        })
        setClassState(newClasses)
    }

    function handleSubmit() {
        let checkedAnything = false
        checked.forEach(cl => {
            if (cl === true) {
                checkedAnything = true
            }
        })
        if (checkedAnything === false) {
            alert("You haven't selected any classes!")
        } else {
            classState.forEach(cl => {
                if (cl.students.includes(userId)) {
                    classesRef.doc(cl.id).set(cl).then(() => {
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                }
            })
            userRef.update({userStage: 2}).then(() => {
                setRedirect(true)
            })
        }
    }

    useEffect(() => {
        classesRef.orderBy("name").get().then(snap => {
            handleClassesSnap(snap)
        }).catch(err => {
            console.log("Error: ", err)
        })
    }, [])

    const classList = classState.map((cl, index) => {
        return (
            <div>
                <div className="post-header">
                    <div className="joinclass-text"><b>{cl.name}</b></div>
                    <input 
                        type="checkbox" 
                        checked={checked[index]} 
                        onChange={() => handleChange(cl.id)}
                        id="like"
                        className="like-button"
                    />
                </div>
                <div className="class-footer">
                    {cl.students.length > 0 && cl.students.length + ((cl.students.length === 1) ? " student" : " students")}
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
    } else if (redirect) {
        return <Redirect to="/class"/>
    } else {
        return (
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="class-header">
                        <h1>Join New Classes</h1>
                    </div>
                    {(classList.length === 0) ? 
                        <center><h3>You have joined all available classes!</h3></center>
                    :
                        <div className="forum">
                            {classList}
                            <div className="joinclass-footer">
                                <button className="long-button" onClick={handleSubmit}><span>Join selected classes </span></button>
                            </div>
                        </div>
                    }
                </div>
            </CSSTransition>
        )
    }
}

export default JoinClass