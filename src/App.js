import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'
import Forum from './Components/Forum'
import ForumDetail from './Components/ForumDetail'
import ClassDetail from './Components/ClassDetail'
import Nav from './Components/Nav'
import Login from './Components/Login'
import AddPost from './Components/AddPost'
import Class from './Components/Class'
import Profile from './Components/Profile'
import {AuthProvider} from './Auth'
import PrivateRoute from './PrivateRoute'


function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Nav />
          <div className="content">
            <Switch>
              
              <PrivateRoute path="/" exact component={Forum} />
              <Route path="/login" component={Login}/>}
              <PrivateRoute path="/post/:id" exact component={ForumDetail}/>
              <PrivateRoute path="/class/:id" exact component={ClassDetail}/>
              <PrivateRoute path="/post" exact component={AddPost}/>
              <PrivateRoute path="/class" exact component={Class}/>
              <PrivateRoute path="/profile" component={Profile}/>
              
            </Switch>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App