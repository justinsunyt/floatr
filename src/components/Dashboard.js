import React from 'react'
import Forum from './Forum'

function Dashboard() {
    return(
        <div className="dashboard">
            <Forum filter="dashboard"/>
        </div>
    )
}

export default Dashboard