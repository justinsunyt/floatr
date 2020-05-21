import React, {useEffect, useState, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function JoinClass() {
    const classesRef = firebase.firestore().collection("classes")
    const {currentUser} = useContext(AuthContext)
    const [classState, setClassState] = useState([])
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const userId = currentUser.uid

    let checked = classState.map(cl => (cl.students.includes(userId)) ? true : false)
    
    function handleClassesSnap(snap) {
        let classes = []
        snap.forEach(doc => {
            let cl = {}
            cl = doc.data()
            cl.id = doc.id
            if (!cl.students.includes(userId)) {
                classes.push(cl)
            }
        })
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
                classesRef.doc(cl.id).set(cl).then(() => {
                    console.log("Wrote to classes")
                    window.location.reload()
                }).catch(err => {
                    console.log("Error: ", err)
                })
            })
        }
    }

    useEffect(() => {
        classesRef.get().then(snap => {
            console.log("Fetched from classes")
            handleClassesSnap(snap)
        }).catch(err => {
            console.log("Error: ", err)
        })
    }, [])

    const classList = classState.map((cl, index) => {
        return (
            <div className="joinclass-item">
                <p>{cl.name}</p>
                <input 
                    type="checkbox" 
                    checked={checked[index]} 
                    onChange={() => handleChange(cl.id)}
                    align="right"
                    id="like"
                />
            </div>
        )
    })

    if (loading) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>   
        )
    } else {
        return (
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="class-header">
                        <h1>Join Class</h1>
                    </div>
                    <div className="class-list">
                        {(!Array.isArray(classList) || !classList.length) ? "You have joined all available classes!" : classList}
                        {(classList.length > 0) && <button className="joinclass-submit" onClick={handleSubmit}><span>Join selected classes </span></button>}
                    </div>     
                </div>
            </CSSTransition>
        )
    }
}

export default JoinClass