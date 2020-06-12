import React, {useState, useEffect, useContext} from 'react'
import {CSSTransition} from 'react-transition-group'
import ReactLoading from 'react-loading'

function Chat() {
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoading(false)
        setLoaded(true)
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
                    <div className="class-header">
                        <h1>Chat</h1>
                        <h3>Chat is coming soon!</h3>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Chat