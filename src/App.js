import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Flexbox from './components/Flexbox';
import BenchmarkBar from './components/BenchmarkBar';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }

  changeValue = event => {
    this.setState({value: Number(event.target.value)})
  }

  render() {
    return (
      <div className="App">
        <Navbar></Navbar>
        <div className="bar-wrapper">
          <input type="number" onChange={this.changeValue} value={this.state.value}/>
          <BenchmarkBar value={this.state.value}></BenchmarkBar>
        </div>
      </div>
    );
  }
}

export default App;
