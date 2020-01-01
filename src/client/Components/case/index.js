import React, { Component } from 'react';

import "./style.scss";


class Case extends Component {
  constructor(props) {
     super(props);

   }
  render() {

    return (
      <div className={"Case "+this.props.color}>
        <h1>_Titre</h1>
        <p>XX %</p>
        <img alt="image_case"/>
      </div>

    );
  }
}

export default Case;
