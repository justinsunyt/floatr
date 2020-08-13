import React, {useState, useEffect} from 'react'
import Forum from './Forum'
import {firestore} from '../firebase'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function ClassDetail({match}) {
    const classRef = firestore.collection("classes").doc(match.params.id)
    const [classState, setClassState] = useState({
        "id" : "",
        "name" : "",
        "students" : []
    })
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    let className = classState.name
    let numStudents = classState.students.length

    useEffect(() => {
        classRef.get().then(doc => {
            setClassState(doc.data())
            setLoading(false)
            setLoaded(true)
        }).catch(err => {
            console.log("Error: ", err)
        })
    }, [])

    if (loading) {
        return (
            <div className="loading-large">
                <ReactLoading type="balls" color="#ff502f" width="100%" delay={1000}/>
            </div>  
        )
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    <div className={"class-header"}>
                        <h1>
                            {className}
                        </h1>
                        <h5>
                            <i>{(numStudents > 0 && numStudents + ((numStudents === 1) ? " student" : " students") + " joined")}</i>
                        </h5>
                    </div>
                    <Forum filter={`class/${match.params.id}`} />
                </div>
            </CSSTransition>
        )
    }
}

export default ClassDetail