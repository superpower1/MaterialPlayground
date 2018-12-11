import React, {Component} from 'react';
import AmCharts from "@amcharts/amcharts3-react";

class AmChart extends Component {
  render() {
    const now = new Date();
    const dataProvider = [{
      date: now
    }]
    const config = {
      "type": "serial",
      "theme": "light",
      "graphs": [{
        "valueField": "value",
        "fillAlphas": 0
      }],
      "valueAxes": [{
        "stackType": "none",
        "maximum": 100,
        "minimum": 0,
        "balloon": {
          "enabled": false
        }
      }],
      "categoryField": "date",
      "categoryAxis": {
        "parseDates": true
      },
      "dataProvider": dataProvider,
      "allLabels": [{
  			"text": "No Available Data",
  			"bold": true,
        "align": "center",
  			"x": 0,
  			"y": "50%",
        "size": 20
  		}]
    };

    return (
      <AmCharts.React options={config} style={{width: '800px', height: '300px', opacity: '0.5'}}/>
    );
  }
}

export default AmChart;
