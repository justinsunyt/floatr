import React from 'react'
import './App.css'
import Forum from './Components/Forum'
import ForumDetail from './Components/ForumDetail'
import ClassDetail from './Components/ClassDetail'
import Nav from './Components/Nav'
import Homepage from './Components/HomepageLogin'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <br />
        <Switch>
          
          <Route path="/" exact component={Homepage}/>} 
          <Route path="/post/:id" component={ForumDetail}/>
          <Route path="/class/:id" component={ClassDetail}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
const Home = () => (
  <div>
  <h1>Welcome to TaskFloat</h1>
</div>
)