import React, {Component} from 'react';
import AmCharts from "@amcharts/amcharts3-react";

// Generate random data
function generateData() {
  var firstDate = new Date();

  var dataProvider = [];

  for (var i = 0; i < 50; ++i) {
    var date = new Date(firstDate.getTime());

    date.setDate(i);

    dataProvider.push({
      date: date,
      value1: Math.floor(Math.random() * 100),
      value2: Math.floor(Math.random() * 100)
    });
  }

  return dataProvider;
}

class AmChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProvider: generateData()
    };
  }

  handleZoom = (e) => {
    const {chart1, chart2} = this.refs;
    chart1.state.chart.zoomToDates(e.startDate, e.endDate);
    chart2.state.chart.zoomToDates(e.startDate, e.endDate);
  }

  render() {
    const config = {
      "type": "serial",
      "theme": "light",
      "listeners": [{
        "event": "zoomed",
        "method": this.handleZoom
      }],
      "graphs": [{
        "id": "g1",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "bulletSize": 5,
        "hideBulletsCount": 50,
        "lineThickness": 2,
        "title": "red line",
        "useLineColorForBulletBorder": true,
        "balloonText": "<span style='font-size:18px;'>value1: [[value]]</span>",
        "valueField": "value1",
        "fillAlphas": 0.5 // 0
      }, {
        "id": "g2",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "bulletSize": 5,
        "hideBulletsCount": 50,
        "lineThickness": 2,
        "title": "blue line",
        "useLineColorForBulletBorder": true,
        "balloonText": "<span style='font-size:18px;'>value2: [[value]]</span>",
        "valueField": "value2",
        "fillAlphas": 0.5 // 0
      }],
      "colors": ["red", "blue"],
      "chartCursor": {
        "pan": false,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "cursorAlpha":1,
        "cursorColor":"#258cbb",
        "limitToGraph":"g1",
        "valueLineAlpha":0.2,
        "valueZoomable": false,
        "zoomable": true
      },
      "valueAxes": [{
        "stackType": "regular" // "none"
      }],
      "categoryField": "date",
      "categoryAxis": {
        "parseDates": true,
        "dashLength": 1,
        "minorGridEnabled": true
      },
      "chartScrollbar": {
        "enabled": true,
        "updateOnReleaseOnly": false
      },
      "dataProvider": this.state.dataProvider
    };

    return (
      <div>
        <AmCharts.React ref="chart1" options={config} style={{width: '800px', height: '300px'}}
        />
        <AmCharts.React ref="chart2" options={config} style={{width: '800px', height: '300px'}}/>
      </div>
    );
  }
}

export default AmChart;
