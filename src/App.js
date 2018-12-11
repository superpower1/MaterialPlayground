import React, { Component } from 'react';
import Navbar from './components/Navbar';
import Flexbox from './components/Flexbox';
import BenchmarkBar from './components/BenchmarkBar';
import Accordion from './components/Accordion';
import Table from './components/Table/Table';
import SychronizedChart from './components/Table/SychronizedChart';
import AmChart from './components/Table/AmChart2';
import NoDataChart from './components/Table/NoDataChart';
import Speedo from './components/BenchmarkSpeedo';
import Map from './components/Map/Map';
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
        {/* <SychronizedChart/> */}
        {/* <AmChart/> */}
        <Map/>
        {/* <NoDataChart/> */}
        <Speedo value={70} rangeMin={50} rangeMax={80}
          segments={12}
          needleColor="steelblue"
          textColor="transparent"
          minValue={0}
          maxValue={100}/>
      </div>
    );
  }
}

export default App;
