import React, {Component} from 'react';
import './_benchmark-bubble.scss';

const percentageToHue= (percentage, hue0, hue1) => {
  return (percentage * (hue1 - hue0)) + hue0;
}

class ProgressBubble extends Component {

  render() {
    const waterColor = `hsla(${percentageToHue(this.props.value / 100, 0, 120)}, 100%, 50%, .7)`;
    const textColor = `hsla(${percentageToHue(this.props.value / 100, 0, 120)}, 100%, 30%, 1)`;

    const {size, fontSize} = this.props;
    const border = 5;
    const bubbleSize = {width:`${size}px`, height:`${size}px`};
    const innerSize = {width:`${size-border*2}px`, height:`${size-border*2}px`};
    const fontStyle = {fontSize: `${fontSize}px`, color: textColor, top: `${size/2-fontSize}px`}

    return (
      <div className="fu-progress" style={{...bubbleSize, border: `${border}px solid ${textColor}`}}>
        <div className="fu-inner" style={{...innerSize, border: `${border}px solid #ffffff`}}>
          <div className="water" style={{
            top: 100-this.props.value+'%',
            backgroundColor: waterColor
          }}></div>
          <div className="fu-percent percent" style={fontStyle}><span>{this.props.value}</span>%</div>
          <div className="glare"></div>
        </div>
      </div>
    );
  }
}

export default ProgressBubble;
