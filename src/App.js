import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'
import Dashboard from './Components/Dashboard'
import ForumDetail from './Components/ForumDetail'
import ClassDetail from './Components/ClassDetail'
import UserDetail from './Components/UserDetail'
import Nav from './Components/Nav'
import Login from './Components/Login'
import AddPost from './Components/AddPost'
import Class from './Components/Class'
import JoinClass from './Components/JoinClass'
import Chat from './Components/Chat'
import Chatroom from './Components/Chatroom'
import Settings from './Components/Settings'
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
              <PrivateRoute path="/post/:id" exact component={ForumDetail}/>
              <PrivateRoute path="/class/:id" exact component={ClassDetail}/>
              <PrivateRoute path="/user/:id" exact component={UserDetail}/>
              <PrivateRoute path="/post" exact component={AddPost}/>
              <PrivateRoute path="/class" exact component={Class}/>
              <PrivateRoute path="/joinclass" component={JoinClass}/>
              <PrivateRoute path="/chat" exact component={Chat}/>
              <PrivateRoute path="/chatroom" exact component={Chatroom}/>
              <PrivateRoute path="/settings" exact component={Settings}/>
            </Switch>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App