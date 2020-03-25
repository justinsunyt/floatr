import React, {useEffect, useState, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'

function Class() {
    const rootRef = firebase.database().ref()
    const {currentUser} = useContext(AuthContext)
    const [classState, setClassState] = useState([])
    const userId = currentUser.uid
    let classes = []

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter == 0) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["students"].includes(userId)) {
                        classes.push(value[i])
                    }
                }
                setClassState(classes)
            }
            counter ++
        }
    }
    
    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
        setInterval(() => {rootRef.on("value", snap => {
            fetchData(snap.val())
        })}, 5000)
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

    return (
        <div>
            <div className="class-header">
                <h1>Classes</h1>
            </div>
            <div className="class-list">
                {classList}
            </div>
        </div>
    )
}

export default Class