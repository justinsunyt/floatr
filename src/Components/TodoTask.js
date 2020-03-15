import React from 'react'

function TodoTask(props) {
    const id = props.task.id
    const completed = props.task.completed

    const title = props.task.title
    const description = props.task.description
    const dueYear = props.task.dueDate.getFullYear()
    const dueMonth = props.task.dueDate.getMonth()
    const dueDay = props.task.dueDate.getDate()

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
            <div className="todo-description">
                <p style={completed ? completedStyle: null}>{description}</p>
            </div> 
            <div className="todo-date">
                <p style={completed ? completedStyle: null}><i>{dueMonth} / {dueDay} / {dueYear}</i></p>
            </div>  
        </div>
    )
}

export default TodoTask