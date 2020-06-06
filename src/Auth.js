import React, {useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import {auth, firestore} from './firebase'

export const AuthContext = React.createContext()

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [userStage, setUserStage] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let hasLoggedIn = false
        let userRef = null
        auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            if (user) {
                hasLoggedIn = true
            }
            if (hasLoggedIn) {
                if (user) {
                    userRef = firestore.collection("users").doc(user.uid)
                }
                const unsubscribe = userRef.onSnapshot(doc => {
                    if (doc.exists) {
                        if (!doc.data().userStage) {
                            setUserStage(0)
                            setLoading(false)
                        } else {
                            setUserStage(doc.data().userStage)
                            setLoading(false)
                        }
                    } else {
                        setUserStage(0)
                        setLoading(false)
                    }
                })
                if (!user) {
                    unsubscribe()
                }
            }
            if (!user) {
                setLoading(false)
            }
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
            <AuthContext.Provider value={{currentUser: currentUser, userStage: userStage}}>
                {children}
            </AuthContext.Provider>
        )
    }
}