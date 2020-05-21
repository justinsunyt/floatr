import React, {useState, useEffect} from 'react'
import Forum from './Forum'
import * as firebase from 'firebase'

function ClassDetail({match}) {
    const classRef = firebase.firestore().collection("classes").doc(match.params.id)
    const [classState, setClassState] = useState({
        "id" : 0,
        "name" : "",
        "students" : []
    })

    let className = classState.name
    let numStudents = classState.students.length

    useEffect(() => {
        classRef.get().then(doc => {
            setClassState(doc.data())
        }).catch(err => {
            console.log("Error: ", err)
        })
    }, [])

    return (
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
    )
}

export default ClassDetail