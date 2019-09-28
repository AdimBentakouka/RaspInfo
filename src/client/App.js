import React, { Component } from 'react';
import { Route } from 'react-router-dom';

//imports views
import Home from './Views/Home';

class App extends Component {
  render() {
    return (
      <div>

        <Route path="/" component={Home}/>

      </div>
    );
  }
}

export default App;
