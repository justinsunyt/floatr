import React, {useState, useEffect} from 'react'
import * as firebase from 'firebase'

export const AuthContext = React.createContext()

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return <div></div>
    } else {
        return(
            <AuthContext.Provider value={{currentUser}}>
                {children}
            </AuthContext.Provider>
        )
    }
}