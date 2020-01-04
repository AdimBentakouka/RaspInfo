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


  intializeTheme()
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

  // Permet de permuter entre le theme sombre et claire
  changeTheme()
  {
    let _theme = undefined;

    if(this.state.theme === "darkTheme")
    {
      _theme = 'clearTheme';
    }

    else
    {
      _theme = 'darkTheme';
    }

    this.setState({theme:_theme});
    cookie.save('theme', _theme, {path:'/'});
  }

  // Pour changer les class selon le thème
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

  // Return l'icon du thème
  iconThemeRender()
  {
    let icon = '';
    if(this.state.theme === "darkTheme")
    {
      icon = 'wb_sunny';
    }
    else
    {
      icon = 'brightness_2';
    }

    return icon;
  }


  componentWillMount()
  {
    // Intialisation du thèmes
    this.intializeTheme();
  }


  render() {
    this.Theme();

    return (
      <div>
        <Menu nightmode={this.state.theme === 'darkTheme' ? true : false } fIconTheme={this.iconThemeRender.bind(this)} fChangeTheme={this.changeTheme.bind(this)}/>
        <Switch>
          <Route path="/" exact render={() => <Dashboard theme={this.state.theme}/> } />
          <Route render={() => <Error numberError='404' description="Il semblerait que la page n'existe pas ..."/> } />
        </Switch>
        <Fab nightmode={this.state.theme === 'darkTheme' ? true : false } theme={this.state.theme}/>
      </div>
    );
  }
}

export default App;
