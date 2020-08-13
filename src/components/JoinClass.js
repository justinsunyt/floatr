import React, {useEffect, useState, useContext} from 'react'
import {firestore} from '../firebase'
import {AuthContext} from '../Auth'
import {Redirect} from 'react-router-dom'
import algoliasearch from 'algoliasearch'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function JoinClass() {
    const classesRef = firestore.collection("classes")
    const {currentUser, userStage, incrementUserStage} = useContext(AuthContext)
    const [classState, setClassState] = useState([])
    const [filteredState, setFilteredState] = useState([])
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [redirectToHome, setRedirectToHome] = useState(false)
    const [redirectToClass, setRedirectToClass] = useState(false)
    const userId = currentUser.uid
    const client = algoliasearch('5MTZD7Z6CS', '85e0d43ba8a4b481872ae0a894d814e3');
    const index = client.initIndex(process.env.NODE_ENV === 'production' ? 'prod_classes' : 'dev_classes');

    let checked = filteredState.map(cl => (cl.students.includes(userId)) ? true : false)
    
    function handleChange(id) {
        let newClasses = classState
        newClasses = newClasses.map(cl => {
            let newClass = cl
            if (cl.objectID === id) {
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
                    classesRef.doc(cl.objectID).set(cl).then(() => {
                    }).catch(err => {
                        console.log("Error: ", err)
                    })
                }
            })
            if (userStage === 1) {
                incrementUserStage(() => setRedirectToHome(true))
            } else {
                setRedirectToClass(true)
            }
        }
    }

    function handleSearch(event) {
        const {value} = event.target
        index.search(value, {hitsPerPage: 1000}).then(({hits}) => {
            let classes = []
            hits.forEach(cl => {
                classState.forEach(c => {
                    if (cl.objectID === c.objectID) {
                        classes.push(c)
                    }
                })
            })
            setFilteredState(classes)
        })
    }

    useEffect(() => {
        index.search("", {hitsPerPage: 1000}).then(({hits}) => {
            let classes = []
            let joinedClasses = []
            hits.forEach(cl => {
                if (!cl.students.includes(userId)) {
                    classes.push(cl)
                } else {
                    joinedClasses.push(cl)
                }
            })
            if (joinedClasses.length > 0 && userStage === 1) {
                incrementUserStage(() => {})
            }
            setClassState(classes)
            setFilteredState(classes)
            setLoading(false)
            setLoaded(true)
        })
    }, [])

    const classList = filteredState.map((cl, index) => {
        return (
            <div key={cl.objectID}>
                <div className="post-header">
                    <div className="joinclass-text"><b>{cl.name}</b></div>
                    <input 
                        type="checkbox" 
                        checked={checked[index]} 
                        onChange={() => handleChange(cl.objectID)}
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
    } else if (redirectToClass) {
        return <Redirect to="/class"/>
    } else if (redirectToHome) {
        return <Redirect to="/"/>
    } else {
        return (
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className="class-header">
                        <h1>Join New Classes</h1>
                        <form>
                            <div className="textbox" style={{marginTop: "40px"}}>
                                <input type="text" name="title" className="addpost-title" placeholder="Search" onChange={handleSearch} required></input>
                            </div>
                        </form>
                    </div>
                    {(classList.length === 0) ? 
                        <center><h3>No available classes! Try searching for something else</h3></center>
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