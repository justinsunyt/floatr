import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import ForumDetail from './components/ForumDetail'
import ClassDetail from './components/ClassDetail'
import UserDetail from './components/UserDetail'
import Nav from './components/Nav'
import Login from './components/Login'
import AddPost from './components/AddPost'
import Class from './components/Class'
import JoinClass from './components/JoinClass'
import Chat from './components/Chat'
import Chatroom from './components/Chatroom'
import Settings from './components/Settings'
import Invite from './components/Invite'
import Join from './components/Join'
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
              <Route path="/login" exact component={Login}/>
              <PrivateRoute path="/post/:id" exact component={ForumDetail}/>
              <PrivateRoute path="/class/:id" exact component={ClassDetail}/>
              <PrivateRoute path="/user/:id" exact component={UserDetail}/>
              <PrivateRoute path="/post" exact component={AddPost}/>
              <PrivateRoute path="/class" exact component={Class}/>
              <PrivateRoute path="/joinclass" exact component={JoinClass}/>
              <PrivateRoute path="/chat" exact component={Chat}/>
              <PrivateRoute path="/chatroom" exact component={Chatroom}/>
              <PrivateRoute path="/settings" exact component={Settings}/>
              <PrivateRoute path="/invite" exact component={Invite}/>
              <PrivateRoute path="/join" exact component={Join}/>
            </Switch>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App