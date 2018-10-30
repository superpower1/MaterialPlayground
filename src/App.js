import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Flexbox from './components/Flexbox';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar></Navbar>
        <Flexbox></Flexbox>
      </div>
    );
  }
}

export default App;
