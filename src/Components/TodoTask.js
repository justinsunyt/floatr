import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as regularIcons from '@fortawesome/free-regular-svg-icons'
import {CSSTransition} from 'react-transition-group'
import { Redirect } from 'react-router-dom'
import moment from 'moment'

function TodoTask(props) {
    const id = props.task.id
    const completed = props.task.completed
    const title = props.task.title
    const dueDate = new Date(JSON.parse(props.task.dueDate))
    const dueYear = dueDate.getFullYear()
    const dueMonth = dueDate.getMonth() + 1
    const dueDay = dueDate.getDate()
    const today = new Date()
    const [showMenu, setShowMenu] = useState(false)

    const completedStyle = {
        fontStyle: "italic",
        color: "#cdcdcd",
        textDecoration: "line-through"
    }

    const overdueStyle = {
        color: "red"
    }

    return (
        <div className="todo-task" onClick={() => setShowMenu(!showMenu)}>
            <div className="todo-title">
                <input 
                    type="checkbox" 
                    checked={completed} 
                    onChange={() => props.handleChange(id, "task")}
                />
                <h3 className="todo-title" style={completed ? completedStyle : null}>{title}</h3>
            </div>
            <div className="todo-footer">
                <div style={completed ? completedStyle : (((moment(dueDate).endOf("day") - today) < 0) ? overdueStyle : null)}><i>{dueMonth} / {dueDay} / {dueYear}</i></div>
                <FontAwesomeIcon className="todo-delete"onClick = {() => props.handleDelete(id)} icon={regularIcons.faTrashAlt}/>
            </div>
            <hr/>
            <CSSTransition in={showMenu} timeout={300} classNames="menu" unmountOnExit>
                <div className="todo-menu" id={"menu" + id}>
                    <div className='todo-form'>
                        <form onSubmit={event => {
                            event.preventDefault()
                            props.handleChange(id, "date")
                            setShowMenu(false)
                        }}>
                            <input type="text" name="date" id="date" autocomplete="off" required/>
                            <label for="date" class="task-label">
                                <span class="task-content">Set new date: M/D(/Y)</span>
                            </label>
                        </form>
                    </div>
                </div>
            </CSSTransition>
        </div>
    )
}

export default TodoTask