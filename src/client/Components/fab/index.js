import React, { Component } from 'react';
import { Button, Icon , Modal} from 'react-materialize';

const axios = require('axios');

const apiURL = "http://preprod.local:3001"; // "http://server.local:3001/";


class Fab extends Component {

  constructor()
  {
    super();
    this.state = {
      modal: false,
      TitreModal: undefined,
      MessageModal: undefined,
      disabledButton: false
    }

    this.RenderModal = this.RenderModal.bind(this);
  }
  themeRender(_color)
  {
    let color = _color;

    if(this.props.theme === "darkTheme")
    {
        color = _color+' darken-3';
    }

    return color;
  }
  setStateButton(_etat)
  {
    this.setState({disabledButton: !_etat, modal:false});
  }
  onClickPowerOff()
  {
    // Appel méthode pour éteindre la RPI
    this.setStateButton(false);

    axios.get(apiURL+'/system/shutdown')
    .then(response => {
      if(response.data.code === 200)
      {
        this.setState({modal: true,
                       TitreModal: "Extinction en cours...",
                       MessageModal: "La Raspberry va s'éteindre dans 5 secondes, le site ne sera plus accessibles..."
                      });
      }
    })
    .catch(err => {
      this.errorRender(err);
    });

    setTimeout(() => this.setStateButton(true), 15000);

  }
  onClickRestart()
  {
    this.setStateButton(false);
    //Appel méthode pour restart la RPI
    axios.get(apiURL+'/system/reboot')
    .then(response => {
      if(response.data.code === 200)
      {
        //Afficher le modal
        this.setState(
        {
          modal: true,
          TitreModal: "Redémarrage en cours ...",
          MessageModal: "la Rasberry va redémarrer dans 5 secondes, le site ne sera plus accessibles..."
        });
      }
    })
    .catch(error =>
    {
        this.errorRender(error);
    })

    setTimeout(() => this.setStateButton(true), 15000);
  }
  errorRender(error)
  {
    if (error.response) {
       this.setState({
         modal: true,
         TitreModal: "Erreur",
         MessageModal: "Error "+error.response.status
       });
     } else if (error.request) {
       this.setState({
         modal: true,
         TitreModal: "Erreur",
         MessageModal: "Aucune réponse reçu ..."
       });
     } else {
       this.setState({
         modal: true,
         TitreModal: "Erreur",
         MessageModal: error.message
       });
     }
  }
  RenderModal()
  {
    if(this.state.modal === true)
    {
      return(
        <Modal className={this.props.theme} header={this.state.TitreModal} open bottomSheet >
          {this.state.MessageModal}
        </Modal>
      );
    }
  }

  render() {

    return (
        <div>

          <Button
            icon = {<Icon>view_module</Icon>}
            floating
            fab={{direction: 'left', hoverEnabled: false}}
            className={this.themeRender("blue-grey")+" no-select"}

            large
          >
            <Button floating icon={<Icon>power_settings_new</Icon>} onClick={ this.onClickPowerOff.bind(this)} className={this.themeRender("red")} disabled = {this.state.disabledButton} />
            <Button floating icon={<Icon>refresh</Icon>} onClick={ this.onClickRestart.bind(this) } className={this.themeRender("green")} disabled = {this.state.disabledButton} />
          </Button>
          {this.RenderModal()}
        </div>

    );
  }
}

export default Fab;
