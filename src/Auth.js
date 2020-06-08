import React, {useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import * as firebase from 'firebase/app'
import {auth, firestore} from './firebase'

export const AuthContext = React.createContext({currentUser: null, userStage: null, incrementUserStage: () => {}})

function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userStage, setUserStage] = useState(null)
    const [loading, setLoading] = useState(true)

    const incrementUserStage = (callback) => {
        firestore.collection("users").doc(currentUser.uid).update({userStage: firebase.firestore.FieldValue.increment(1)}).then(() => {
            setUserStage(prevStage => {
                return (prevStage + 1)
            })
            callback()
        }).catch(err => console.log(err))
    }
    
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setLoading(true)
            setCurrentUser(user)
            if (user) {
                const userRef = firestore.collection("users").doc(user.uid)
                userRef.get().then(doc => {
                    if (doc.exists) {
                        setUserStage(doc.data().userStage)
                    } else {
                        setUserStage(0)
                    }
                    setLoading(false)
                })
            } else {
                setUserStage(0)
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
            <AuthContext.Provider value={{currentUser, userStage, incrementUserStage}}>
                {children}
            </AuthContext.Provider>
        )
    }
}

export {AuthProvider}