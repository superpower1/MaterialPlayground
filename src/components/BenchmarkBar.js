import React, {Component} from 'react';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={false}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

class BenchmarkBar extends Component {
  render() {
    const {value} = this.props;
    const handleStyle = {
      cursor: 'default',
      borderColor: value>=80?'rgb(72, 205, 61)':value>=30?'rgb(233, 230, 57)':'rgb(253, 69, 35)'
    }
    const trackStyle = {
      backgroundColor: value>=80?'rgb(72, 205, 61)':value>=30?'rgb(233, 230, 57)':'rgb(253, 69, 35)'
    }

    return (
      <div className="benchmark-bar-wrapper">
        <Slider min={0} max={100} defaultValue={0}
          handle={handle}
          handleStyle={[handleStyle]}
          trackStyle={[trackStyle]}
          value={value}
        />
      </div>
    );
  }
}

export default BenchmarkBar;
