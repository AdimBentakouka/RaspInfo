import React, { Component } from 'react';

import { Navbar, NavItem,Icon } from 'react-materialize';

import { Link } from 'react-router-dom';

import "./style.scss";


const darkTheme = 'blue-grey darken-4';
const clearTheme = 'blue-grey lighten-2';

class Menu extends Component {


  themeRender(_modenight)
  {
    let color;

    if(_modenight)
    {
      color = darkTheme ;
    }
    else
    {
      color = clearTheme;
    }

    return color;
  }


  render() {

    return (
      <Navbar className={this.themeRender(this.props.nightmode)+" no-select"} brand={<div className="title">Rasp<span>Info</span></div>} alignLinks="right">
        <Link to="/">DashBoard <Icon left>dashboard</Icon></Link>
        <Link to="/folder">FTP<Icon left>folder</Icon></Link>
        <Link to="/ssh">SSH<Icon left>desktop_windows</Icon></Link>
        <Link to="/config">Configuration<Icon left>build</Icon></Link>
        <NavItem onClick={this.props.fChangeTheme.bind(this)} ><Icon left>{this.props.fIconTheme()}</Icon></NavItem>
      </Navbar>

    );
  }
}

export default Menu;
