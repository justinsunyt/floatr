import React, {useEffect, useState, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'

function Class() {
    const rootRef = firebase.database().ref()
    const {currentUser} = useContext(AuthContext)
    const [classState, setClassState] = useState([])
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const userId = currentUser.uid
    let classes = []

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter === 0) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i]["students"].includes(userId)) {
                        classes.push(value[i])
                    }
                }
                setClassState(classes)
            }
            counter ++
        }
        setLoading(false)
        setLoaded(true)
    }
    
    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
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