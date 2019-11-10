import React from 'react';
import BpkLoadingButton from 'bpk-component-loading-button';
import BpkLargeFlightIcon from 'bpk-component-icon/lg/flight';
import BpkText from 'bpk-component-text';
import BpkLink from 'bpk-component-link';
import BpkDatepicker from 'bpk-component-datepicker';
import format from 'date-fns/format';
import BpkInput, { INPUT_TYPES, CLEAR_BUTTON_MODES } from 'bpk-component-input';
import BpkTicket from 'bpk-component-ticket';
import STYLES from './App.scss';
import ReactDOM from "react-dom";
import Authentication from "./Authentication";

const c = className => STYLES[className] || 'UNKNOWN';

// const App = () => (
//   <div className={c('App')}>
//     <header className={c('App__header')}>
//       <div className={c('App__header-inner')}>
//         <BpkText tagName="h1" textStyle="xxl" className={c('App__heading')}>Welcome to React + Backpack</BpkText>
//       </div>
//     </header>
//     <main className={c('App__main')}>
//       <BpkText tagName="p" className={c('App__text')}>
//         To get started, edit <BpkCode>src/App.jsx</BpkCode> and save to reload.
//       </BpkText>
//       <BpkButton onClick={() => f}>Click me</BpkButton>
//     </main>
//
//
//   </div>
// );
//
//
// class FlightForm extends React.Component {
//
//   render() {
//     return <h1>Hello, {this.props.name}</h1>;
//   }
// }

const formatDate = date => format(date, 'YYYY-MM-DD');
const formatDateFull = date => format(date, 'dddd, Do MMMM YYYY');
const formatMonth = date => format(date, 'MMMM YYYY');
const formatTime = date => format(date, 'hh:mm');
const daysOfWeek = [
  {
    name: 'Sunday',
    nameAbbr: 'Sun',
    index: 0,
    isWeekend: true,
  },
  {
    name: 'Monday',
    nameAbbr: 'Mon',
    index: 1,
    isWeekend: false,
  },
  {
    name: 'Tuesday',
    nameAbbr: 'Tue',
    index: 2,
    isWeekend: false,
  },
  {
    name: 'Wednesday',
    nameAbbr: 'Wed',
    index: 3,
    isWeekend: false,
  },
  {
    name: 'Thursday',
    nameAbbr: 'Thu',
    index: 4,
    isWeekend: false,
  },
  {
    name: 'Friday',
    nameAbbr: 'Fri',
    index: 5,
    isWeekend: false,
  },
  {
    name: 'Saturday',
    nameAbbr: 'Sat',
    index: 6,
    isWeekend: true,
  },
];

const inline_left = {
  margin: '20px',
  marginLeft: '15%',
  display: 'inline-block',
};

const inline_center = {
  margin: '20px',
  marginLeft: '20%',
  marginRight: '20%',
  display: 'inline-block',
};

const inline_right = {
  margin: '20px',
  marginRight: '15%',
  display: 'inline-block',
};

const inline_stub = {
  marginTop: '20px',
};

function authenticate(e, discussion_id) {
  ReactDOM.render(React.createElement(Authentication), document.getElementById('root'));
  window.discussion_id = discussion_id;
}

function getFlightTicketsComponents(flightTickets) {
  let rows = [];
  for (let key in flightTickets){
    let flight = flightTickets[key];
    let destinationTime = Date.parse(flight["FlightDateTime"]);
    let duration = Date.parse(flight["FlightDateTime"]) - Date.parse(flight["FlightDateTime"]);
    let stub = (
      <div style={inline_stub}>
        {flight["Price"] + " Euro"}
        <br/>
        <BpkLink href='#' onClick={(e) => authenticate(e, flight['DiscussionId'])}>{flight['DiscussionId']}</BpkLink>
      </div>
    );

    rows.push(
      <div>
        <br/>
        <BpkTicket stub={stub}>
          <div style={inline_left}>
            <BpkText>{flight["IataFrom"]}</BpkText>
            <br/>
            <BpkText>{formatTime(destinationTime)}</BpkText>
          </div>
          <div style={inline_center}>
            <BpkText>{formatTime(duration)}</BpkText>
            <br/>
            <BpkLargeFlightIcon className="abc-icon__flight" />
          </div>
          <div style={inline_right}>
            <BpkText>{flight["IataTo"]}</BpkText>
            <br/>
            <BpkText>{formatTime(destinationTime)}</BpkText>
          </div>
        </BpkTicket>
      </div>
    );
  }
  return <div>{rows}</div>;
}

class FlightForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originValue: "",
      destinationValue: "",
      selectedDate: null,
      flightTickets: null,
    };
  }

  updateFlightTickets(flightTickets){
    this.setState({flightTickets: getFlightTicketsComponents(flightTickets)})
  }

  handleChange (e) {
    if (e.target.id == "origin") this.setState({originValue: e.target.value});
    if (e.target.id == "destination") this.setState({destinationValue: e.target.value});
  }

  handleClickClear (e) {
    if (e == "origin") this.setState({originValue: ''});
    if (e == "destination") this.setState({destinationValue: ''});
  }

  handleDateSelect = date => {
    this.setState({
      selectedDate: date,
    });
  };

  handleSubmit () {
    fetch('http://localhost:5000/next', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "from": this.state.originValue,
          "to": this.state.destinationValue,
          "date": formatDate(this.state.selectedDate),
        }),
    })
    .then(response => response.json())
    .then(data => this.updateFlightTickets(data));
  }

  render () {
    return (
      <div>
        <BpkInput
          id="origin"
          type={INPUT_TYPES.text}
          className ={c('App__BpkInput')}
          name="origin"
          value={this.state.originValue}
          onChange={(e) => {this.handleChange(e)}}
          placeholder="Origin: Country, city or airport"
          clearButtonMode={CLEAR_BUTTON_MODES.whileEditing}
          clearButtonLabel="Clear"
          onClear={() => {this.handleClickClear("origin")}}
        />
        <BpkInput
          id="destination"
          type={INPUT_TYPES.text}
          className ={c('App__BpkInput')}
          name="destination"
          value={this.state.destinationValue}
          onChange={(e) => {this.handleChange(e)}}
          placeholder="Destination: Country, city or airport"
          clearButtonMode={CLEAR_BUTTON_MODES.whileEditing}
          clearButtonLabel="Clear"
          onClear={() => {this.handleClickClear("destination")}}
        />
        <BpkDatepicker
          id="datepicker"
          className={c("App__BpkDatepicker")}
          style = {{marginLeft: 20em}}
          daysOfWeek={daysOfWeek}
          weekStartsOn={1}
          changeMonthLabel="Change month"
          closeButtonText="Close"
          title="Departure date"
          getApplicationElement={() => document.getElementById('pagewrap')}
          formatDate={formatDate}
          formatMonth={formatMonth}
          formatDateFull={formatDateFull}
          onDateSelect={this.handleDateSelect}
          date={this.state.selectedDate}
        />
        <BpkLoadingButton 
        className={c("App__BpkLoadingButton")}
        iconOnly onClick={this.handleSubmit.bind(this)}
        >
          <span>Search Flights</span>
        </BpkLoadingButton>
        {this.state.flightTickets}
      </div>
    )
  }
}

export default FlightForm;
