import React, {useState} from 'react'
import TodoTask from './TodoTask'
import todoData from '../Api/todoData'

function TodoList() {
    const [todos, setTodos] = useState(todoData)

    function handleChange(id) {
        setTodos(prevTodos => {
            const updatedTodos = prevTodos.map(todo => {
                if (todo.id === id) {
                    todo.completed = !todo.completed
                }
                return todo
            })
            return updatedTodos
        })
    }

    const todoList = todos.map(task => <TodoTask key={task.id} task={task} handleChange={handleChange}/>)
    return(
        <div className='todo-list'>
            {todoList}
        </div>
    )
}

export default TodoList