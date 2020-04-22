import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'
import Dashboard from './Components/Dashboard'
import TodoList from './Components/TodoList'
import ForumDetail from './Components/ForumDetail'
import ClassDetail from './Components/ClassDetail'
import Nav from './Components/Nav'
import Login from './Components/Login'
import AddPost from './Components/AddPost'
import Class from './Components/Class'
import Profile from './Components/Profile'
import JoinClass from './Components/JoinClass'
import {AuthProvider} from './Auth'
import PrivateRoute from './PrivateRoute'


function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute component={Nav}/>
          <div className="content">
            <Switch>
              <PrivateRoute path="/" exact component={Dashboard}/>
              <Route path="/login" component={Login}/>
              <PrivateRoute path="/todo" component={TodoList}/>
              <PrivateRoute path="/post/:id" exact component={ForumDetail}/>
              <PrivateRoute path="/class/:id" exact component={ClassDetail}/>
              <PrivateRoute path="/post" exact component={AddPost}/>
              <PrivateRoute path="/class" exact component={Class}/>
              <PrivateRoute path="/profile" component={Profile}/> 
              <PrivateRoute path="/joinclass" component={JoinClass}/>
            </Switch>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App