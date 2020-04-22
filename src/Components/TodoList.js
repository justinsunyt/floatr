import React, {useState, useContext, useEffect} from 'react'
import {AuthContext} from '../Auth'
import * as firebase from 'firebase'
import TodoTask from './TodoTask'
import ReactLoading from 'react-loading'
import {CSSTransition} from 'react-transition-group'
import moment from 'moment'

function TodoList() {
    const rootRef = firebase.database().ref()
    const [forumState, setForumState] = useState([])
    const [classState, setClassState] = useState([])
    const [userState, setUserState] = useState([])
    const [currentUserState, setCurrentUserState] = useState({
        "id": 0,
        "mod": false,
        "todos": []
    })
    const [filteredState, setFilteredState] = useState([])
    const {currentUser} = useContext(AuthContext)
    const userId = currentUser.uid
    const [loading, setLoading] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const today = new Date()
    let availableId = 0
    
    currentUserState.todos.forEach(task => {
        if (task.id >= availableId) {
            availableId = task.id + 1
        }
    })

    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter === 0) {
                setClassState(value)
            }
            if (counter === 1) {
                setForumState(value)
            }
            if (counter === 2) {
                let includesUser = false
                for (let i = 0; i < value.length; i++) {
                    if (value[i].id === userId) {
                        includesUser = true
                    }
                    if (!value[i].todos) {
                        value[i].todos = []
                    }
                }
                if (!includesUser) {
                    value.push({
                        "id": userId,
                        "mod": false,
                        "todos" : []
                    })
                }
                // initialize userData for user if undefined
                setUserState(value)
                for (let i = 0; i < value.length; i++) {
                    if (value[i].id === userId) {
                        setCurrentUserState(value[i])
                        let filteredTodos = value[i].todos
                        filteredTodos.sort((a, b) => {
                            const d1 = new Date(JSON.parse(a.dueDate))
                            const d2 = new Date(JSON.parse(b.dueDate))
                            return (d1 - d2)
                        })
                        let completed = []
                        filteredTodos = filteredTodos.filter(todo => {
                            if (todo.completed) {
                                completed.push(todo)
                            }
                            return !todo.completed
                        })
                        setFilteredState(filteredTodos.concat(completed))
                    }
                }
            }
            counter ++
        }
        setLoading(false)
        setLoaded(true)
    }

    function handleChange(id, type) {
        if (type === "task") {
            let change = "(un)checked todo"
            setCurrentUserState(prevUser => {
                const updatedUser = prevUser
                const updatedTodos = prevUser.todos.map(todo => {
                    if (todo.id === id) {
                        todo.completed = !todo.completed
                    }
                    return todo
                })
                updatedUser.todos = updatedTodos
                setUserState(prevUserState => {
                    const updatedUserState = prevUserState
                    for (let i = 0; i < updatedUserState.length; i++) {
                        if (updatedUserState[i].id === userId) {
                            updatedUserState[i] = updatedUser
                        }
                    }
                    console.log("Writing data to Firebase, change: " + change)
                    rootRef.set({"classData": classState, "forumData": forumState, "userData": updatedUserState})
                    return updatedUserState
                })
                return updatedUser
            })
        } else if (type === "date") {
            if (moment(document.getElementById("date").value, "M/D/Y", true).isValid()) {
                const date = new Date(document.getElementById("date").value)
                let change = "changed date"
                setCurrentUserState(prevUser => {
                    const updatedUser = prevUser
                    const updatedTodos = prevUser.todos.map(todo => {
                        if (todo.id === id) {
                            todo.dueDate = JSON.stringify(date)
                        }
                        return todo
                    })
                    updatedUser.todos = updatedTodos
                    setUserState(prevUserState => {
                        const updatedUserState = prevUserState
                        for (let i = 0; i < updatedUserState.length; i++) {
                            if (updatedUserState[i].id === userId) {
                                updatedUserState[i] = updatedUser
                            }
                        }
                        console.log("Writing data to Firebase, change: " + change)
                        rootRef.set({"classData": classState, "forumData": forumState, "userData": updatedUserState})
                        return updatedUserState
                    })
                    return updatedUser
                })
                document.getElementById("date").value = ""
            } else if (moment(document.getElementById("date").value, "M/D", true).isValid()) {
                const date = new Date(document.getElementById("date").value)
                date.setFullYear(today.getFullYear())
                let change = "changed date"
                setCurrentUserState(prevUser => {
                    const updatedUser = prevUser
                    const updatedTodos = prevUser.todos.map(todo => {
                        if (todo.id === id) {
                            todo.dueDate = JSON.stringify(date)
                        }
                        return todo
                    })
                    updatedUser.todos = updatedTodos
                    setUserState(prevUserState => {
                        const updatedUserState = prevUserState
                        for (let i = 0; i < updatedUserState.length; i++) {
                            if (updatedUserState[i].id === userId) {
                                updatedUserState[i] = updatedUser
                            }
                        }
                        console.log("Writing data to Firebase, change: " + change)
                        rootRef.set({"classData": classState, "forumData": forumState, "userData": updatedUserState})
                        return updatedUserState
                    })
                    return updatedUser
                })
                document.getElementById("date").value = ""
            } else {
                alert("Invalid date! Please use the format M/D or M/D/Y")
            } 
        }
        console.log("Succesfully wrote data")
        console.log("New state:")
        console.log(currentUserState)
    }

    function handleSubmit(event) {
        event.preventDefault()
        const input = document.getElementById("task")
        if (input.value === "") {
            alert("You cannot add nothing")
        } else {
            let change = "added todo"
            setCurrentUserState(prevUser => {
                const updatedUser = prevUser
                updatedUser.todos.push({
                    "id": availableId,
                    "title": input.value,
                    "dueDate": JSON.stringify(today),
                    "completed": false
                })
                setUserState(prevUserState => {
                    const updatedUserState = prevUserState
                    for (let i = 0; i < updatedUserState.length; i++) {
                        if (updatedUserState[i].id === userId) {
                            updatedUserState[i] = updatedUser
                        }
                    }
                    console.log("Writing data to Firebase, change: " + change)
                    rootRef.set({"classData": classState, "forumData": forumState, "userData": updatedUserState})
                    return updatedUserState
                })
                return updatedUser
            })
            console.log("Succesfully wrote data")
            console.log("New state:")
            console.log(userState)
            document.getElementById("task").value = ""
        }
    }

    function handleDelete(id) {
        const change = "deleted task"
        setCurrentUserState(prevUser => {
            const updatedUser = prevUser
            updatedUser.todos.forEach((task, index) => {
                if (task.id === id) {
                        updatedUser.todos.splice(index, 1)
                }
            })     
            setUserState(prevUserState => {
                const updatedUserState = prevUserState
                for (let i = 0; i < updatedUserState.length; i++) {
                    if (updatedUserState[i].id === userId) {
                        updatedUserState[i] = updatedUser
                    }
                }
                console.log("Writing data to Firebase, change: " + change)
                rootRef.set({"classData": classState, "forumData": forumState, "userData": updatedUserState})
                return updatedUserState
            })
            return updatedUser
        })
        console.log("Succesfully wrote data")
        console.log("New state:")
        console.log(userState)
    }

    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
        // fetch forum data when component mounts
        setInterval(() => {rootRef.on("value", snap => {
            fetchData(snap.val())
        })}, 500)
    }, [])

    const todoList = filteredState.map(task => <TodoTask key={task.id} task={task} handleChange={handleChange} handleDelete={handleDelete}/>)

    if (loading) {
        return (
            <div className="forum-header">
                <ReactLoading type="bars" color="black" width="10%"/>
            </div>
        )
    } else {
        return(
            <CSSTransition in={loaded} timeout={300} classNames="fade">
                <div>
                    {(currentUserState.todos.length === 0) ?
                        <div>
                            <div className='todo-form'>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" name="task" id="task" autocomplete="off" required/>
                                    <label for="task" class="task-label">
                                        <span class="task-content">Add a task</span>
                                    </label>
                                </form>
                            </div>
                        </div>
                    : 
                        <div>
                            <div className='todo-form'>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" name="task" id="task" autocomplete="off" required/>
                                    <label for="task" class="task-label">
                                        <span class="task-content">Add a task</span>
                                    </label>
                                </form>
                            </div>
                            <div className='todo-list'>
                                {todoList}
                            </div>
                        </div> 
                    }
                </div>
            </CSSTransition>
        )
    }
}

export default TodoList