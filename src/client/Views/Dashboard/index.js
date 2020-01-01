import React, { Component } from 'react';
import {Container,Row, Col} from 'react-materialize';

import Case from '../../Components/case';

class Home extends Component {
  themeRender(_color)
  {
    let color = _color;

    if(this.props.theme === "darkTheme")
    {
        color = 'blue-grey darken-4';
    }

    return color;
  }

  render() {
    return (
      <div className="Dashboard">
        <Container>
          <Row>
            <Col s={3}>
              <Case id='1' color={this.themeRender("blue-grey")} />


            </Col>
            <Col s={3}>
              <Case id='2'  color={this.themeRender("blue-grey")} />

            </Col>
            <Col s={3}>
              <Case id='3'  color={this.themeRender("blue-grey")} />
            </Col>
            <Col s={3}>
              <Case id='4'  color={this.themeRender("blue-grey")} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
