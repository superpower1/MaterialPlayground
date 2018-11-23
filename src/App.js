import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Flexbox from './components/Flexbox';
import BenchmarkBar from './components/BenchmarkBar';
import Accordion from './components/Accordion';
import Table from './components/Table/Table';
import Speedo from './components/BenchmarkSpeedo';
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
        <Accordion></Accordion>
        {/* <Table/> */}
        <Speedo value={70}
          segments={3}
          needleColor="steelblue"
          minValue={0}
          maxValue={100}/>
      </div>
    );
  }
}

export default App;
