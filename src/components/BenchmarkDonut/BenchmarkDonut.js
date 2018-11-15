import React, {Component} from 'react';
import './_benchmark-donut.scss';

const percentageToHsl = (percentage, hue0, hue1) => {
  const hue = (percentage * (hue1 - hue0)) + hue0;
  return 'hsl(' + hue + ', 100%, 50%)';
}

class BenchmarkDonut extends Component {
  render() {

    const halfsize = (this.props.size * 0.5);
    const radius = halfsize - this.props.strokewidth;
    const circumference = 2 * Math.PI * radius;
    const strokeval = circumference - ((this.props.value * circumference) / 100);
    const dashval = (strokeval + ' ' + circumference);

    const trackstyle = {strokeWidth: this.props.strokewidth};
    const indicatorstyle = {strokeWidth: this.props.strokewidth, strokeDasharray: dashval}
    const rotateval = `rotate(-90, ${halfsize},${halfsize})`;
    const rotateval2 = `rotate(-90, ${halfsize},${halfsize}) translate(0, ${2*halfsize}) scale(1, -1)`;

    const angleInRadians = ((this.props.value / 100) * 360 - 90) * Math.PI / 180.0;
    const pointX = halfsize + radius * Math.cos(angleInRadians);
    const pointY = halfsize + radius * Math.sin(angleInRadians);
    const pointColor = percentageToHsl((this.props.value / 100), 0, 120);

    const circumference2 = 2 * Math.PI * (radius-this.props.strokewidth);
    const strokeval2 = (this.props.benchmarkValue * circumference2) / 100;
    const dashval2 = (strokeval2 + ' ' + circumference2);
    const benchmarkstyle = {strokeWidth: this.props.strokewidth/2, strokeDasharray: dashval2}

    return (
      <svg width={this.props.size} height={this.props.size} className="donutchart">
        <linearGradient id="linearColors1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="33%" stopColor="hsl(0, 100%, 50%)"/>
          <stop offset="100%" stopColor="hsl(60, 100%, 50%)"/>
        </linearGradient>
        <linearGradient id="linearColors2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="33%" stopColor="hsl(120, 100%, 50%)"/>
          <stop offset="100%" stopColor="hsl(60, 100%, 50%)"/>
        </linearGradient>
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={trackstyle} className="donutchart-track"/>
        <path d={`M ${halfsize} ${halfsize}
          m 0, -${radius}
          a ${radius},${radius} 0 0,1 0,${radius*2}`}
          style={{fill: 'none', stroke:"url(#linearColors1)", strokeWidth:this.props.strokewidth}}/>
        <path d={`M ${halfsize} ${halfsize}
          m 0, ${radius}
          a ${radius},${radius} 0 0,1 0,-${radius*2}`}
          style={{fill: 'none', stroke:"url(#linearColors2)", strokeWidth:this.props.strokewidth}}/>

        <circle r={radius-this.props.strokewidth} cx={halfsize} cy={halfsize} transform={rotateval} style={benchmarkstyle} className="donutchart-benchmark"/>
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval2} style={indicatorstyle} className="donutchart-indicator"/>
        <circle r={this.props.strokewidth/4*3} cx={pointX} cy={pointY} style={{fill: pointColor, stroke:'#DAE2E5', strokeWidth:this.props.strokewidth/4}}/>

        <text className="donutchart-text" x={halfsize} y={halfsize} style={{textAnchor:'middle'}} >
          <tspan className="donutchart-text-val">{this.props.value}</tspan>
          <tspan className="donutchart-text-sub">/100</tspan>
          <tspan className="donutchart-text-label" x={halfsize} y={halfsize+20}>{this.props.valuelabel}</tspan>
        </text>
      </svg>
    );
  }
}

export default BenchmarkDonut;
