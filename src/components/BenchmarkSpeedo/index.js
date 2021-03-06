// React Component to show speedometer like gauge with d3
import React from "react"
import PropTypes from "prop-types"

// selectively import d3 components for reducing file size
// import * as d3 from "d3";
import {
  format as d3Format,
  scaleLinear as d3ScaleLinear,
  range as d3Range,
  arc as d3Arc,
  select as d3Select,
  line as d3Line,
  curveMonotoneX as d3CurveMonotoneX,
  pie as d3Pie,
  rgb as d3Rgb,
  interpolateHsl as d3InterpolateHsl,
  // importing all the easing functions
  easeLinear as d3EaseLinear,
  easeQuadIn as d3EaseQuadIn,
  easeQuadOut as d3EaseQuadOut,
  easeQuadInOut as d3EaseQuadInOut,
  easeCubicIn as d3EaseCubicIn,
  easeCubicOut as d3EaseCubicOut,
  easeCubicInOut as d3EaseCubicInOut,
  easePolyIn as d3EasePolyIn,
  easePolyOut as d3EasePolyOut,
  easePolyInOut as d3EasePolyInOut,
  easeSinIn as d3EaseSinIn,
  easeSinOut as d3EaseSinOut,
  easeSinInOut as d3EaseSinInOut,
  easeExpIn as d3EaseExpIn,
  easeExpOut as d3EaseExpOut,
  easeExpInOut as d3EaseExpInOut,
  easeCircleIn as d3EaseCircleIn,
  easeCircleOut as d3EaseCircleOut,
  easeCircleInOut as d3EaseCircleInOut,
  easeBounceIn as d3EaseBounceIn,
  easeBounceOut as d3EaseBounceOut,
  easeBounceInOut as d3EaseBounceInOut,
  easeBackIn as d3EaseBackIn,
  easeBackOut as d3EaseBackOut,
  easeBackInOut as d3EaseBackInOut,
  easeElasticIn as d3EaseElasticIn,
  easeElasticOut as d3EaseElasticOut,
  easeElasticInOut as d3EaseElasticInOut,
  easeElastic as d3EaseElastic
} from "d3"

function calculateNeedleHeight(height_ratio, radius) {
  if (height_ratio < 0 || height_ratio > 1) {
    throw new Error(`Invalid needleHeightRatio given - ${height_ratio}`)
  }
  return Math.round(radius * height_ratio)
}

class ReactSpeedometer extends React.Component {
  static displayName = "ReactSpeedometer"

  constructor(props) {
    super(props)

    // list of d3 refs to share within the components
    this._d3_refs = {
      powerGauge: false
    }

    // the initial value is 0;
    // on subsequent renders we will update the initial value with previous value for animating
    this.initialValue = 0
  }

  componentWillMount() {}

  componentDidMount() {
    // render the gauge here
    this.renderGauge()
  }

  render = () => {
    return <div ref={(ref) => (this.gaugeDiv = ref)} />
  }

  componentWillReceiveProps() {
    // update the initial value
    this.initialValue = this.props.value || 0
  }

  shouldComponentUpdate(new_props) {
    return true
    // NOTE: following logic for 'stopRerender'
    // update the props
    this.props = new_props
    // just update our readings
    this.updateReadings()
    // DO NOT UPDATE THE WHOLE COMPONENT
    return false
  }

  componentWillUpdate() {}

  componentDidUpdate() {
    // on update, check if 'forceRender' option is present;
    if (this.props.forceRender) {
      this.renderGauge()
    } else {
      // let us just animate the value of the speedometer
      this.updateReadings()
    }
  }

  getGauge() {
    var self = this // save reference

    var PROPS = this.props

    // main gauge function;
    // takes a container inside which we will display the speedometer
    // here container is our gaugeDiv ref
    // return function (container) {
    return (container) => {
      // default config that are 'not' configurable
      var default_config = {
        ringInset: 20,

        pointerWidth: 10,
        pointerTailLength: 5,
        // pointerHeadLengthPercent: 0.9,

        minAngle: -90,
        maxAngle: 90,

        labelInset: 10,

        // calculate the ReactSpeedometer 'parentNode' width/height; it might be used if fluidWidth: true
        parentWidth: self.gaugeDiv.parentNode.clientWidth,
        parentHeight: self.gaugeDiv.parentNode.clientHeight
      }

      // START: Configurable values
      var config = {
        // width/height config
        // if fluidWidth; width/height taken from the parent of the ReactSpeedometer
        // else if width/height given it is used; else our default
        width: PROPS.fluidWidth ? default_config.parentWidth : PROPS.width,
        height: PROPS.fluidWidth ? default_config.parentHeight : PROPS.height,
        // ring width should be 1/4 th of width
        ringWidth: PROPS.ringWidth,
        // min/max values
        minValue: PROPS.minValue,
        maxValue: PROPS.maxValue,
        // color of the speedometer needle
        needleColor: PROPS.needleColor,
        // segments in the speedometer
        majorTicks: PROPS.segments,
        // color range for the segments
        arcColorFn: d3InterpolateHsl(d3Rgb(PROPS.startColor), d3Rgb(PROPS.endColor)),
        // needle configuration
        needleTransition: PROPS.needleTransition,
        needleTransitionDuration: PROPS.needleTransitionDuration,
        needleHeightRatio: PROPS.needleHeightRatio,
        // text color
        textColor: PROPS.textColor,
        // label format
        labelFormat: d3Format(PROPS.valueFormat),
        // value text string (template string)
        currentValueText: PROPS.currentValueText,
        // value range min
        rangeMin: PROPS.rangeMin,
        // value range max
        rangeMax: PROPS.rangeMax,
      }
      // END: Configurable values

      // merge default config with the config
      config = Object.assign({}, default_config, config)

      var range = undefined,
        r = undefined,
        needleLength = undefined,
        value = 0,
        svg = undefined,
        arc = undefined,
        rangeArcs = undefined,
        scale = undefined,
        ticks = undefined,
        tickData = undefined

      // var donut = d3.pie();
      var donut = d3Pie()

      function deg2rad(deg) {
        return (deg * Math.PI) / 180
      }

      function newAngle(d) {
        var ratio = scale(d)
        var newAngle = config.minAngle + ratio * range

        return newAngle
      }

      function configure() {
        // merge the config with incoming (optional) configuration
        // config = Object.assign( {}, config, configuration );

        range = config.maxAngle - config.minAngle
        // r = config.size / 2;
        r = config.width / 2

        // needleLength = Math.round(r * config.needleHeightRatio)
        needleLength = calculateNeedleHeight(config.needleHeightRatio, r)

        // a linear scale that maps domain values to a percent from 0..1
        // scale = d3.scaleLinear()
        scale = d3ScaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue])

        ticks = scale.ticks(config.majorTicks)

        // [d3-scale][issue]: https://github.com/d3/d3-scale/issues/149
        if (ticks.length === 1) {
          // we have this specific `d3 ticks` behaviour stepping in a specific way
          ticks = [config.minValue, config.maxValue]
        }

        // tickData = d3.range(config.majorTicks)
        tickData = d3Range(config.majorTicks).map(function() {
          return 1 / config.majorTicks
        })

        // arc = d3.svg.arc()
        // arc = d3.arc()
        arc = d3Arc()
          .innerRadius(r - config.ringWidth - config.ringInset)
          .outerRadius(r - config.ringInset)
          .startAngle(function(d, i) {
            var ratio = d * i
            return deg2rad(config.minAngle + ratio * range)
          })
          .endAngle(function(d, i) {
            var ratio = d * (i + 1)
            return deg2rad(config.minAngle + ratio * range)
          })

        rangeArcs = d3Arc()
          .innerRadius((r - config.ringWidth - config.ringInset)*0.8)
          .outerRadius((r - config.ringInset)*0.8)
          .startAngle(function() {
            return deg2rad(-90 + (config.rangeMin - config.minValue)/(config.maxValue - config.minValue)*180)
          })
          .endAngle(function() {
            return deg2rad(-90 + (config.rangeMax - config.minValue)/(config.maxValue - config.minValue)*180)
          })
      }

      function centerTranslation() {
        return "translate(" + r + "," + r + ")"
      }

      function isRendered() {
        return svg !== undefined
      }

      function render(newValue) {

        // svg = d3.select(container)
        svg = d3Select(container)
          .append("svg:svg")
          // .attr('class', 'gauge')
          // adding class 'speedometer' for the main svg holder
          .attr("class", "speedometer")
          .attr("width", config.width)
          .attr("height", config.height)

        var centerTx = centerTranslation()

        var arcs = svg
          .append("g")
          .attr("class", "arc")
          .attr("transform", centerTx)

        arcs
          .selectAll("path")
          .data(tickData)
          .enter()
          .append("path")
          .attr("class", "speedo-segment")
          .attr("fill", function(d, i) {
            return config.arcColorFn(d * i)
          })
          .attr("d", arc)

        arcs
          .append("path")
          .attr("fill", "rgba(0,0,0,0.3)")
          .attr("d", rangeArcs)

        var lg = svg
          .append("g")
          .attr("class", "label")
          .attr("transform", centerTx)

        lg.selectAll("text")
          .data(ticks)
          .enter()
          .append("text")
          .attr("transform", function(d) {
            var ratio = scale(d)
            var newAngle = config.minAngle + ratio * range
            return "rotate(" + newAngle + ") translate(0," + (config.labelInset - r) + ")"
          })
          .text(config.labelFormat)
          // add class for text label
          .attr("class", "segment-value")
          // styling stuffs
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-weight", "bold")
          // .style("fill", "#666");
          .style("fill", config.textColor)

        // save current value reference
        self._d3_refs.current_value_text = svg
          .append("g")
          .attr("transform", "translate(" + config.width / 2 + "," + config.width / 2 + ")")
          .append("text")
          // add class for the text
          .attr("class", "current-value")
          .attr("text-anchor", "middle")
          // position the text 23pt below
          .attr("y", 23)
          // add text
          .text(config.currentValue || "")
          .style("font-size", "16px")
          .style("font-weight", "bold")
          // .style("fill", "#666");
          .style("fill", config.textColor)

        var lineData = [[config.pointerWidth / 2, 0], [0, -needleLength], [-(config.pointerWidth / 2), 0], [0, config.pointerTailLength], [config.pointerWidth / 2, 0]]

        // var pointerLine = d3.svg.line().interpolate('monotone');
        // var pointerLine = d3.line()
        var pointerLine = d3Line()
          // .curve( d3.curveMonotoneX );
          .curve(d3CurveMonotoneX)

        var pg = svg
          .append("g")
          .data([lineData])
          .attr("class", "pointer")
          .attr("transform", centerTx)
          .style("fill", config.needleColor)
        // .style("stroke", "green");

        self._d3_refs.pointer = pg
          .append("path")
          .attr("d", pointerLine)
          .attr("transform", "rotate(" + config.minAngle + ")")

        // TODO: no need to update inside render;
        // we will explicitly call 'update' method when needed to update
        // update(newValue === undefined ? 0 : newValue);
      }

      // formats current value
      // ref: https://stackoverflow.com/a/29771751/1410291
      function formatCurrentValueText(currentValue) {
        let value = config.labelFormat(currentValue)
        // simply replace ${value} with value to support IE9/10/11
        return config.currentValueText.replace("${value}", value)

        // NOTE: not using template string to support IE 9/10/11
        // ref: https://caniuse.com/#feat=template-literals

        // if needed, maybe we can later add some polyfill support
        // ref: https://stackoverflow.com/a/29771751/1410291
        function assemble(literal, params) {
          // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
          return new Function(params, "return `" + literal + "`;")
        }
        var template = assemble(config.currentValueText, "value")
        return template(value)
      }

      function update(newValue) {
        var ratio = scale(newValue)

        var newAngle = config.minAngle + ratio * range
        // update the pointer
        self._d3_refs.pointer
          .transition()
          .duration(config.needleTransitionDuration)
          // .ease( d3EaseLinear )
          .ease(self.getTransitionMethod(config.needleTransition))
          // .ease( d3EaseElastic )
          .attr("transform", "rotate(" + newAngle + ")")
        // update the current value
        // self._d3_refs.current_value_text.text( config.labelFormat( newValue ) );
        self._d3_refs.current_value_text.text(formatCurrentValueText(newValue))
      }

      // configure for first time !?
      configure()

      // return a object with all our functions;
      // also expose the 'config' object; for now, we will update the 'labelFormat' while updating
      return {
        configure: configure,
        isRendered: isRendered,
        render: render,
        update: update,
        // exposing the config object
        config: config
      }
    }
  }

  renderGauge() {
    // console.log("rendering gauge ");
    // before rendering remove the existing gauge?
    // d3.select( this.gaugeDiv )
    d3Select(this.gaugeDiv)
      .select("svg")
      .remove()
    // store the gauge in our d3_refs
    this._d3_refs.powerGauge = this.getGauge()(this.gaugeDiv)
    // render for first time; no value means initializes with 0
    this._d3_refs.powerGauge.render(this.initialValue)
    // update readings for the first time
    this.updateReadings()
  }

  updateReadings() {
    // refresh the config of 'labelFormat'
    this._d3_refs.powerGauge.config.labelFormat = d3Format(this.props.valueFormat || "")
    // refresh the current value text
    this._d3_refs.powerGauge.config.currentValueText = this.props.currentValueText || "${value}"
    // updates the readings of the gauge with the current prop value
    // animates between old prop value and current prop value
    this._d3_refs.powerGauge.update(this.props.value || 0)
  }

  // takes a 'transition string' and returns a d3 transition method
  // default is easeLinear
  getTransitionMethod(transition) {
    switch (transition) {
      // ease linear
      case "easeLinear":
        return d3EaseLinear
      // easeQuadIn as d3EaseQuadIn,
      case "easeQuadIn":
        return d3EaseQuadIn
      // easeQuadOut as d3EaseQuadOut
      case "easeQuadOut":
        return d3EaseQuadOut
      // easeQuadInOut as d3EaseQuadInOut
      case "easeQuadInOut":
        return d3EaseQuadInOut
      // easeCubicIn as d3EaseCubicIn
      case "easeCubicIn":
        return d3EaseCubicIn
      // easeCubicOut as d3EaseCubicOut,
      case "easeCubicOut":
        return d3EaseCubicOut
      // easeCubicInOut as d3EaseCubicInOut,
      case "easeCubicInOut":
        return d3EaseCubicInOut
      // easePolyIn as d3EasePolyIn,
      case "easePolyIn":
        return d3EasePolyIn
      // easePolyOut as d3EasePolyOut,
      case "easePolyOut":
        return d3EasePolyOut
      // easePolyInOut as d3EasePolyInOut,
      case "easePolyInOut":
        return d3EasePolyInOut
      // easeSinIn as d3EaseSinIn,
      case "easeSinIn":
        return d3EaseSinIn
      // easeSinOut as d3EaseSinOut,
      case "easeSinOut":
        return d3EaseSinOut
      // easeSinInOut as d3EaseSinInOut,
      case "easeSinInOut":
        return d3EaseSinInOut
      // easeExpIn as d3EaseExpIn,
      case "easeExpIn":
        return d3EaseExpIn
      // easeExpOut as d3EaseExpOut,
      case "easeExpOut":
        return d3EaseExpOut
      // easeExpInOut as d3EaseExpInOut,
      case "easeExpInOut":
        return d3EaseExpInOut
      // easeCircleIn as d3EaseCircleIn,
      case "easeCircleIn":
        return d3EaseCircleIn
      // easeCircleOut as d3EaseCircleOut,
      case "easeCircleOut":
        return d3EaseCircleOut
      // easeCircleInOut as d3EaseCircleInOut,
      case "easeCircleInOut":
        return d3EaseCircleInOut
      // easeBounceIn as d3EaseBounceIn,
      case "easeBounceIn":
        return d3EaseBounceIn
      // easeBounceOut as d3EaseBounceOut,
      case "easeBounceOut":
        return d3EaseBounceOut
      // easeBounceInOut as d3EaseBounceInOut,
      case "easeBounceInOut":
        return d3EaseBounceInOut
      // easeBackIn as d3EaseBackIn,
      case "easeBackIn":
        return d3EaseBackIn
      // easeBackOut as d3EaseBackOut,
      case "easeBackOut":
        return d3EaseBackOut
      // easeBackInOut as d3EaseBackInOut,
      case "easeBackInOut":
        return d3EaseBackInOut
      // easeElasticIn as d3EaseElasticIn,
      case "easeElasticIn":
        return d3EaseElasticIn
      // easeElasticOut as d3EaseElasticOut,
      case "easeElasticOut":
        return d3EaseElasticOut
      // easeElasticInOut as d3EaseElasticInOut,
      case "easeElasticInOut":
        return d3EaseElasticInOut
      // easeElastic as d3EaseElastic,
      case "easeElastic":
        return d3EaseElastic
      // ease elastic transition
      case "easeElastic":
        return d3EaseElastic

      // if not a valid transition; throw a warning and return the default transition
      default:
        console.warn("Invalid needle transition '", transition, "'. Switching to default transition 'easeQuadInOut'")
        return d3EaseQuadInOut
    }
  }
}

// define the proptypes
// make all the props and 'required' and provide sensible default in the 'defaultProps'
ReactSpeedometer.propTypes = {
  value: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  rangeMin: PropTypes.number,
  rangeMax: PropTypes.number,

  // tracks if the component should update as the whole or just animate the value
  // default will just animate the value after initialization/mounting
  forceRender: PropTypes.bool.isRequired,

  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fluidWidth: PropTypes.bool.isRequired,

  // segments to show in the speedometer
  segments: PropTypes.number.isRequired,

  // color strings
  needleColor: PropTypes.string.isRequired,
  startColor: PropTypes.string.isRequired,
  endColor: PropTypes.string.isRequired,

  // needle transition type and duration
  needleTransition: PropTypes.string.isRequired,
  needleTransitionDuration: PropTypes.number.isRequired,
  needleHeightRatio: PropTypes.number.isRequired,

  ringWidth: PropTypes.number.isRequired,
  textColor: PropTypes.string.isRequired,

  // d3 format identifier is generally a string; default "" (empty string)
  valueFormat: PropTypes.string.isRequired,
  // value text format
  currentValueText: PropTypes.string.isRequired
}

// define the default proptypes
ReactSpeedometer.defaultProps = {
  value: 0,
  minValue: 0,
  maxValue: 1000,
  rangeMin: 0,
  rangeMax: 0,

  forceRender: false,

  width: 300,
  height: 300,
  fluidWidth: false,

  // segments to show in the speedometer
  segments: 5,

  // color strings
  needleColor: "steelblue",
  startColor: "#FF471A",
  endColor: "#33CC33",

  // needle transition type and duration
  needleTransition: "easeQuadInOut",
  needleTransitionDuration: 500,
  needleHeightRatio: 0.9,

  ringWidth: 60,

  // text color (for both showing current value and segment values)
  textColor: "#666",

  // label format => https://github.com/d3/d3-format
  // by default ""; takes valid input for d3 format
  valueFormat: "",

  // value text string format; by default it just shows the value
  // takes es6 template string as input with a default ${value}
  currentValueText: "${value}"
}

export default ReactSpeedometer
