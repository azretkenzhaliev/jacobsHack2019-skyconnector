import React from 'react';
import BpkButton from 'bpk-component-button';
import BpkInput, { INPUT_TYPES, CLEAR_BUTTON_MODES } from 'bpk-component-input';
import { BpkGridContainer, BpkGridRow, BpkGridColumn } from 'bpk-component-grid';
import BpkText from "bpk-component-text";


const inline = {
  display: 'inline-block',
};

const left = {
  marginLeft: 250,
  marginBottom: 50,
};

const right = {
  marginLeft: 900,
  marginBottom: 50,
};

function getOther (msg) {
  return (
    <BpkGridRow>
      <BpkGridColumn width={1}>""</BpkGridColumn>
      <BpkGridColumn width={7}>
        {msg}
      </BpkGridColumn>
      <BpkGridColumn width={4}>""</BpkGridColumn>
    </BpkGridRow>
  )
}

function getSelf (msg) {
  return (
    <BpkGridRow>
      <BpkGridColumn width={9}>""</BpkGridColumn>
      <BpkGridColumn width={2}>
        {msg}
      </BpkGridColumn>
      <BpkGridColumn width={1}>""</BpkGridColumn>
    </BpkGridRow>
  )
}

function getMessages (data) {
  let rows = [];
  for (let key in data){
    let msg = data["UserId"]+": "+data["Message"];
    if (data["UserId"] == window.user_email){
      rows.push(getSelf(msg));
    }else{
      rows.push(getOther(msg));
    }
  }
  return <BpkGridContainer>{rows}</BpkGridContainer>;
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messages: null,
    };
  }

  componentDidMount() {
    this.setState({
      messages: null,
    })
  }

  updateMessages(data) {
    this.setState({messages: getMessages(data)});
    return 1
  }

  get_messages () {
    fetch('http://localhost:5000/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "UserId": window.user_email,
          "DiscussionId": window.discussion_id,
        }),
    })
    .then(response => response.json())
    .then(data => this.updateMessages(data));

    return 0;
  }

  post_message() {
    fetch('http://localhost:5000/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "UserId": window.user_email,
          "DiscussionId": window.discussion_id,
          "Message": this.state.message,
        }),
    })
    .then(response => response.json())
    .then(data => this.get_messages());

    return 0;
  }

  i = this.get_messages();

  handleChange (e) {
    this.setState({message: e.target.value})
  }

  render () {
    return (
      <div>
        <BpkGridContainer>
          <BpkGridRow>
            <BpkGridColumn width={9}></BpkGridColumn>
            <BpkGridColumn width={2}>
              {"Azamat: Hi there!"}
            </BpkGridColumn>
            <BpkGridColumn width={1}></BpkGridColumn>
          </BpkGridRow>
          <BpkGridRow>
            <BpkGridColumn width={1}></BpkGridColumn>
            <BpkGridColumn width={7}>
              {"Azret: Hi :)"}
            </BpkGridColumn>
            <BpkGridColumn width={4}></BpkGridColumn>
          </BpkGridRow>
          <BpkGridRow>
            <BpkGridColumn width={1}></BpkGridColumn>
            <BpkGridColumn width={7}>
              {"Alim: I have no baggage, so I can take yours~~"}
            </BpkGridColumn>
            <BpkGridColumn width={4}></BpkGridColumn>
          </BpkGridRow>
          <BpkGridRow>
            <BpkGridColumn width={8}></BpkGridColumn>
            <BpkGridColumn width={3}>
              {"Azamat: Nice, I have a document to send to my mom"}
            </BpkGridColumn>
            <BpkGridColumn width={1}></BpkGridColumn>
          </BpkGridRow>

          <BpkGridRow>
            <BpkGridColumn width={1}></BpkGridColumn>
            <BpkGridColumn width={7}>
              {"Alim: Cool, dm me @amanzholov_8"}
            </BpkGridColumn>
            <BpkGridColumn width={4}></BpkGridColumn>
          </BpkGridRow>


          <BpkGridRow>
            <BpkGridColumn width={1}></BpkGridColumn>
            <BpkGridColumn width={8}>
              <BpkInput
                id="msg"
                type={INPUT_TYPES.text}
                name="msg"
                value={this.state.message}
                onChange={(e) => {this.handleChange(e)}}
                placeholder="Message"
              />
            </BpkGridColumn>
            <BpkGridColumn width={2}>
              <BpkButton featured={true} onClick={this.post_message.bind(this)}>Send</BpkButton>
            </BpkGridColumn>
            <BpkGridColumn width={1}></BpkGridColumn>
          </BpkGridRow>
        </BpkGridContainer>
      </div>
    );
  }
}

export default Chat;
