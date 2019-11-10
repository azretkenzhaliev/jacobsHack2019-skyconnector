import React from 'react';
import BpkButton from 'bpk-component-button';
import BpkRadio from 'bpk-component-radio';
import BpkInput, { INPUT_TYPES, CLEAR_BUTTON_MODES } from 'bpk-component-input';

const inline_left = {
  margin: '20px',
  marginLeft: '15%',
  display: 'inline-block',
};

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      radio: "signup",
    };
  }

  getMessages (data) {
    
  }

  get_messages () {
    fetch('http://localhost:5000/login', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "UserId": this.state.email,
          "DiscussionId": this.state.password,
        }),
    })
    .then(response => response.json())
    .then(data => this.getMessages(data));
  }

  handleRadioChange (e) {
    if (e.target.id == "signup"){
      this.setState({radio: "signup"})
    }else{
      this.setState({radio: "login"})
    }
  }

  handleChange (e) {
    if (e.target.id == "email") this.setState({email: e.target.value});
    if (e.target.id == "password") this.setState({password: e.target.value});
  }

  handleClickClear (e) {
    if (e == "email") this.setState({originValue: ''});
    if (e == "password") this.setState({destinationValue: ''});
  }

  handleSubmit () {
    fetch('http://localhost:5000/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": this.state.email,
          "password": this.state.password,
          "flag": this.state.radio == "signup" ? "sign-up" : "sign-in"
        }),
    })
    .then(response => response.json())
    .then(data => this.handleAuthentication(data));
    //this.updateFlightTickets(data)
  }

  render () {
    return (
      <div>
        <h1>Azretuwkaaa</h1>
      </div>
    );
  }
}

export default Chat;
