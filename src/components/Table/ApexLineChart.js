import React, {Component} from 'react';
import Chart from "react-apexcharts";

const generateRandomNumber = (min, max) => {
  return Math.random() * (max-min) + min ;
}

const generateRandomArray = (length) => {
  return Array.from({length: length}, () => generateRandomNumber(0,100));
}

class ApexLineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {      
        chart: {
          id: "basic-line",
          animations: {
            enabled: false
          }
        },
        xaxis: {
          categories: Array.from({length: 30}, (v, k) => k+1)
        }
      }
    }
  }

  render() {
    return (
      <div>
        <Chart
          options={this.state.options}
          series={this.props.series}
          type="line"
          width="500"
        />
      </div>
    );
  }
}

export default ApexLineChart;
