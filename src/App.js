import React from 'react'
import './App.css'
import Forum from './Components/Forum'
import ForumDetail from './Components/ForumDetail'
import ClassDetail from './Components/ClassDetail'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact render={() => <Forum filter={"all"}/>} />
          <Route path="/post/:id" component={ForumDetail}/>
          <Route path="/class/:id" component={ClassDetail}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
