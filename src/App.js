import React from 'react'
import './App.css'
import Forum from './Components/Forum'
import ForumDetail from './Components/ForumDetail'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Forum}/>
          <Route path="/post/:id" component={ForumDetail}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
