import React, {Component} from 'react';

import {Route, Switch } from "react-router-dom";
import cookie from 'react-cookies';


//imports views
import Dashboard from './Views/Dashboard';
import Error from './Views/Error';

//Components
import Menu from "./Components/menu";
import Fab from "./Components/fab";

import './App.scss';

class App extends Component {

  componentWillMount()
  {
    let themeCookie = cookie.load('theme');

    if(themeCookie !== undefined )
    {
      this.setState({theme: themeCookie});
    }
    else
    {
      this.setState({theme: 'clearTheme'});
    }
  }

  changeTheme(_theme)
  {
    this.setState({theme:_theme});
    cookie.save('theme', _theme, {path:'/'});
  }
  //Pour body
  Theme()
  {
    if(this.state.theme === 'darkTheme')
    {
      document.body.className = 'darkTheme';
    }
    else
    {
      document.body.className = 'clearTheme';
    }
  }

  render() {
    this.Theme();
    return (
      <div className={this.state.theme}>
        <Menu theme={this.state.theme} fChangeTheme={this.changeTheme.bind(this)}/>
        <Switch>
          <Route path="/" exact render={() => <Dashboard theme={this.state.theme}/> } />
          <Route render={() => <Error numberError='404' description="Il semblerait que la page n'existe pas ..."/> } />
        </Switch>
        <Fab theme={this.state.theme}/>
      </div>
    );
  }
}

export default App;
