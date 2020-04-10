import React, {useEffect, useState, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import ReactLoading from 'react-loading'


function JoinClass() {
    const rootRef = firebase.database().ref()
    const {currentUser} = useContext(AuthContext)
    const [classState, setClassState] = useState([])
    const [forumState, setForumState] = useState([])
    const [userState, setUserState] = useState([])
    const [filteredState, setFilteredState] = useState([])
    const [loading, setLoading] = useState(true)
    const userId = currentUser.uid

    let checked = filteredState.map(cl => (cl.students.includes(userId)) ? true : false)
	
    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter === 0) {
                let filtered = []
                for (let i = 0; i < value.length; i++) {
                    if (!value[i]["students"].includes(userId)) {
                        filtered.push(value[i])
                    }
                }
                setClassState(value)
                setFilteredState(filtered)
            }
            if (counter === 1) {
                setForumState(value)
            }
            if (counter === 2) {
                setUserState(value)
            }
            counter ++
        }
        setLoading(false)
    }
    
    function handleChange(id) {
        let change = ""
        setClassState(prevState => {
            const updatedClasses = prevState.map(cl => {
                let newClass = cl
                if (cl.id === id) {
                    if (cl.students.includes(userId)) {
                        const filteredStudents = cl.students.filter(value => {
                            if (value !== userId) {
                                return value
                            }
                        })
                        newClass.students = filteredStudents
                        change = "unchecked class"
                        // if class is checked, uncheck class
                    } else {
                        if (!newClass.students) {
                            newClass.students = []
                        }
                        newClass.students.push(userId)
                        change = "checked class"
                        // if class is unchecked, check class
                    }
                }
                return newClass
            })
            console.log(change)
            return updatedClasses
        })
        console.log("New state:")
        console.log(classState)
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
            console.log("Writing data to Firebase, change: joined classes")
            rootRef.set({"classData": classState, "forumData": forumState, "userData": userState})
            console.log("Succesfully wrote data")
            window.location.reload()
        }
    }

    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
    }, [])

    const classList = filteredState.map((cl, index) => {
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
            <div>
                <div className="class-header">
                    <h1>Join Class</h1>
                </div>
                <div className="class-list">
                    {(!Array.isArray(classList) || !classList.length) ? "You have joined all available classes!" : classList}
                    {(classList.length > 0) && <button className="joinclass-submit" onClick={handleSubmit}><span>Join selected classes </span></button>}
                </div>     
            </div>   
        )
    }
}

export default JoinClass