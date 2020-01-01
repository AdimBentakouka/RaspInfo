import React, { Component } from 'react';

import { Navbar, NavItem,Icon } from 'react-materialize';

import { Link } from 'react-router-dom';

import "./style.scss";

class Menu extends Component {


  themeRender(_color)
  {
    let color = _color;

    if(this.props.theme === "darkTheme")
    {
        color = 'blue-grey darken-4';
    }

    return color;
  }

  iconThemeRender()
  {
    let icon = '';
    if(this.props.theme === "darkTheme")
    {
      icon = 'wb_sunny';
    }
    else
    {
      icon = 'brightness_2';
    }

    return icon;

  }

  onClickTheme()
  {
    let theme = '';
    if(this.props.theme === "darkTheme")
    {
      theme = "clearTheme";
    }
    else
    {
      theme = "darkTheme";
    }
    this.props.fChangeTheme(theme)
  }

  render() {

    return (
      <Navbar className={this.themeRender("blue-grey")+" no-select"} brand={<div className="title">Rasp<span>Info</span></div>} alignLinks="right">
        <Link to="/">DashBoard <Icon left>dashboard</Icon></Link>
        <Link to="/folder">FTP<Icon left>folder</Icon></Link>
        <Link to="/ssh">SSH<Icon left>desktop_windows</Icon></Link>
        <Link to="/config">Configuration<Icon left>build</Icon></Link>
        <NavItem onClick={this.onClickTheme.bind(this)} ><Icon left>{this.iconThemeRender()}</Icon></NavItem>
      </Navbar>

    );
  }
}

export default Menu;
