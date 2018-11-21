import React, {Component} from 'react';
import ApexLineChart from './ApexLineChart';

const generateRandomNumber = (min, max) => {
  return Math.random() * (max-min) + min ;
}

const generateRandomArray = (length) => {
  return Array.from({length: length}, () => generateRandomNumber(0,100));
}

const generateRandomData = (number) => {
  return Array.from({length: number}, (v, index) => {
    return [
      {
        name: "my-data "+index,
        data: generateRandomArray(30)
      }
    ]
  });
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: generateRandomData(20)
    }
  }

  updateData = () => {
    this.setState({
      data: generateRandomData(20)
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.updateData}>Update Data</button>
        {
          this.state.data.map((item, index) => {
            return <ApexLineChart series={item} key={index}/>
          })
        }
      </div>
    );
  }
}

export default Table;
