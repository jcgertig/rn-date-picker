'use strict';

import React, { PropTypes, DatePickerIOS } from 'react-native';

const noop = () => {};

const DatePicker = React.createClass({
  getDefaultProps() {
    return {
      defaultDate: new Date(),
      onDateChange: noop
    };
  },
  onDateChange(date){
    this.props.onDateChange(date);
  },
  render() {
    const props = this.props;
    const date = typeof props.date !== 'undefined' ? new Date(props.date) : props.defaultDate;
    const minDate = typeof props.minDate !== 'undefined' ? new Date(props.minDate) : props.minDate;
    const maxDate = typeof props.maxDate !== 'undefined' ? new Date(props.maxDate) : props.maxDate;
    return (
      <DatePickerIOS
        date={date}
        mode={props.mode}
        onDateChange={this.onDateChange}
        minimumDate={minDate}
        maximumDate={maxDate}
        minuteInterval={props.minuteInterval}
        timeZoneOffsetInMinutes={props.timeZoneOffsetInMinutes}
      />
    );
  },
});


module.exports = DatePicker;
