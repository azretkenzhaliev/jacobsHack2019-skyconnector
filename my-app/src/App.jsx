import React from 'react';
import { BpkCode } from 'bpk-component-code';
import BpkButton from 'bpk-component-button';
import BpkText from 'bpk-component-text';
import BpkInput, { INPUT_TYPES, CLEAR_BUTTON_MODES } from 'bpk-component-input';

import STYLES from './App.scss';

const c = className => STYLES[className] || 'UNKNOWN';

const f = fetch('http://localhost:5000/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify("HAllO"), // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => console.log(data));

const App = () => (
  <div className={c('App')}>
    <header className={c('App__header')}>
      <div className={c('App__header-inner')}>
        <BpkText tagName="h1" textStyle="xxl" className={c('App__heading')}>Welcome to React + Backpack</BpkText>
      </div>
    </header>
    <main className={c('App__main')}>
      <BpkText tagName="p" className={c('App__text')}>
        To get started, edit <BpkCode>src/App.jsx</BpkCode> and save to reload.
      </BpkText>
      <BpkButton onClick={() => f}>Click me</BpkButton>
    </main>

    <BpkInput
      id="origin"
      type={INPUT_TYPES.text}
      name="origin"
      value="Edinburgh"
      onChange={() => console.log('input changed!')}
      placeholder="Country, city or airport"
      clearButtonMode={CLEAR_BUTTON_MODES.whileEditing}
      clearButtonLabel="Clear"
      onClear={() => console.log('input cleared!')}
    />
  </div>
);

export default App;
