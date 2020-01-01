import React, { Component } from 'react';


class Error extends Component {
  render() {
    return (
      <div className="Error">
        Error {this.props.numberError} : {this.props.description}
      </div>
    );
  }
}

export default Error;
