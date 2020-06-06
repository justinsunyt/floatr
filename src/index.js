import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV === "production") {
    console.log = function() {}
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
