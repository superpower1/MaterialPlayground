import React, {Component} from 'react';
import ApexLineChart from './ApexLineChart';

function generateDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = baseval;
    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([x, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}

class SyncChart extends Component {
  render() {
    return (
      <div>
        <ApexLineChart
          series={[{
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
              min: 10,
              max: 60
            })
          }]}
          options={{
            chart: {
              id: 'fb',
              group: 'social',
            },
            colors: ['#008FFB'],
          }}
        />
        <ApexLineChart
          series={[{
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
              min: 10,
              max: 30
            })
          }]}
          options={{
            chart: {
              id: 'tw',
              group: 'social',
            },
            colors: ['#546E7A'],
          }}
        />
        <ApexLineChart
          series={[{
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
              min: 10,
              max: 90
            })
          }]}
          options={{
            chart: {
              id: 'yt',
              group: 'social',
            },
            colors: ['#00E396'],
          }}
        />
      </div>
    );
  }
}

export default SyncChart;
