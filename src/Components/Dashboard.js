import React from 'react'
import Forum from './Forum'
import TodoList from './TodoList'

function Dashboard() {
    return(
        <div className="dashboard">
            <Forum />
            <TodoList />
        </div>
    )
}

export default Dashboard