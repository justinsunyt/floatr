import React, {useContext} from 'react'
import Forum from './Forum'
import {AuthContext} from '../Auth'


function Dashboard() {
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid

    return(
        <div className="dashboard">
            <Forum filter="dashboard"/>
        </div>
    )
}

export default Dashboard