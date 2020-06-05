import React, {useState, useEffect} from 'react'
import {auth} from 'firebase/app'
import ReactLoading from 'react-loading'
import {firestore} from 'firebase/app'

export const AuthContext = React.createContext()

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [userStage, setUserStage] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        if (currentUser !== null) {
            const userRef = firestore().collection("users").doc(currentUser.uid)
            const unsubscribe = userRef.onSnapshot(doc => {
                if (doc.exists) {
                    if (!doc.data().userStage) {
                        setUserStage(0)
                    } else {
                        setUserStage(doc.data().userStage)
                    }
                } else {
                    setUserStage(0)
                }
                setLoading(false)
            })
            return () => {
                unsubscribe()
            }
        }
    }, [currentUser])

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