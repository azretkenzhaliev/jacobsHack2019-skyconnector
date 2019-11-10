import React from 'react';
import BpkButton from 'bpk-component-button';
import BpkRadio from 'bpk-component-radio';
import BpkInput, { INPUT_TYPES, CLEAR_BUTTON_MODES } from 'bpk-component-input';
import BpkCard from 'bpk-component-card';
import { BpkGridContainer, BpkGridRow, BpkGridColumn } from 'bpk-component-grid';

import STYLES from './Authentication.scss';
const c = className => STYLES[className] || 'UNKNOWN';
const id = id => STYLES[id] || "UNKNOWN";

const inline_left = {
  margin: '20px',
  marginLeft: '15%',
  display: 'inline-block',
};

class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      radio: "signup",
    };
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
    .then(data => console.log(data));
    //this.updateFlightTickets(data)
  }

  render () {
    return (
      <div>
        <BpkGridContainer>
          <BpkGridRow>
            <BpkGridColumn width={6} tabletWidth={12}>
              <BpkRadio
                id="signup"
                className={c('Authentication__BpkRadio')}
                name="authentication"
                label="Sign Up"
                onChange={(e) => (this.handleRadioChange(e))}
                checked={this.state.radio == "signup"}
              />
            </BpkGridColumn>
            <BpkGridColumn width={6} tabletWidth={12}>
              <BpkRadio
                id="login"
                className={c('Authentication__BpkRadio')}
                name="authentication"
                label="Log In"
                onChange={(e) => this.handleRadioChange(e)}
                checked={this.state.radio == "login"}
              />
            </BpkGridColumn>
          </BpkGridRow>
        </BpkGridContainer>
        <BpkCard className={c('Authentication__BpkCard')}>
          <BpkInput
            id="email"
            className={c('Authentication__BpkInput')}
            type={INPUT_TYPES.email}
            name="email"
            value={this.state.email}
            onChange={(e) => {this.handleChange(e)}}
            placeholder="Email: "
            clearButtonMode={CLEAR_BUTTON_MODES.whileEditing}
            clearButtonLabel="Clear"
            onClear={() => {this.handleClickClear("origin")}}
          />
          <br/>
          <BpkInput
            id="password"
            className={c('Authentication__BpkInput')}
            type={INPUT_TYPES.password}
            name="password"
            value={this.state.password}
            onChange={(e) => {this.handleChange(e)}}
            placeholder="Password: "
            clearButtonMode={CLEAR_BUTTON_MODES.whileEditing}
            clearButtonLabel="Clear"
            onClear={() => {this.handleClickClear("origin")}}
          />
          <br/>
          <BpkButton 
          className={c('Authentication__BpkButton')}
          featured={true} 
          onClick={this.handleSubmit.bind(this)}>
            Enter
          </BpkButton>
        </BpkCard>
      </div>
    );
  }
}

export default Authentication;
