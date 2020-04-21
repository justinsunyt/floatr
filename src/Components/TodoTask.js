import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as regularIcons from '@fortawesome/free-regular-svg-icons'

function TodoTask(props) {
    const id = props.task.id
    const completed = props.task.completed
    const title = props.task.title
    const dueDate = new Date(JSON.parse(props.task.dueDate))
    const dueYear = dueDate.getFullYear()
    const dueMonth = dueDate.getMonth() + 1
    const dueDay = dueDate.getDate()

    const completedStyle = {
        fontStyle: "italic",
        color: "#cdcdcd",
        textDecoration: "line-through"
    }
    
    return (
        <div className="todo-task">
            <div className="todo-title">
                <input 
                    type="checkbox" 
                    checked={completed} 
                    onChange={() => props.handleChange(id)}
                />
                <h3 className="todo-title" style={completed ? completedStyle: null}>{title}</h3>
            </div>
            <div className="todo-footer">
                <div style={completed ? completedStyle: null}><i>{dueMonth} / {dueDay} / {dueYear}</i></div>
                <FontAwesomeIcon className="todo-delete"onClick = {() => props.handleDelete(id)} icon={regularIcons.faTrashAlt}/>
            </div>
            <hr/>
        </div>
    )
}

export default TodoTask