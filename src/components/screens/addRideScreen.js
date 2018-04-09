import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Picker,
  Slider,
  View,
  Text,
  TouchableOpacity,
  TimePickerAndroid,
  DatePickerAndroid
} from 'react-native';
import { styles } from '../../lib/styles';
import Screens from '../../lib/screens';
import {
  getDisplayDate,
  getDisplayTime,
  updateYear,
  updateMonth,
  updateDay,
  updateHour,
  updateMinute
} from '../../lib/helpers';
import { addInProgressRide } from '../../lib/storage';
import { Hoshi } from 'react-native-textinput-effects';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';

type Props = {};
export default class AddRideScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      weight: 0.0,
      defaultLevel: 2,
      level: 0,
      program: '',
      date: {
        datetime: '',
        displayDate: '',
        displayTime: ''
      }
    };

    this.setDates = this.setDates.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.startRide = this.startRide.bind(this);
  }

  componentWillMount() {
    this.setDates(Date.now());
  }

  setDates(dateValue) {
    const tempDate = {
      datetime: dateValue,
      displayDate: getDisplayDate(dateValue),
      displayTime: getDisplayTime(dateValue)
    };

    this.setState({ date: Object.assign({}, tempDate) }); //eslint-disable-line  react/no-set-state
  }

  updateTime() {
    TimePickerAndroid.open().then((result) => {
      if (result.action !== TimePickerAndroid.dismissedAction) {
        let updatedTime = updateHour(this.state.date.datetime, result.hour);
        updatedTime = updateMinute(updatedTime, result.minute);
        this.setDates(updatedTime);
      }
    }).catch((code, message) => {
      console.warn('Cannot open time picker', message);
    });
  }

  updateDate() {
    DatePickerAndroid.open().then((result) => {
      if (result.action !== DatePickerAndroid.dismissedAction) {
        let updatedTime = updateYear(this.state.date.datetime, result.year);
        updatedTime = updateMonth(updatedTime, result.month);
        updatedTime = updateDay(updatedTime, result.day);
        this.setDates(updatedTime);
      }
    }).catch((code, message) => {
      console.warn('Cannot open time picker', message);
    });
  }

  startRide() {
    const ride = {
      weight: this.state.weight,
      program: this.state.program,
      level: this.state.level,
      datetime: this.state.date.datetime
    };

  }

  render() {
    const programs = ["Ride in the park", "Hills"];
    const programPickerItems = programs.map((program, i) => {
      return (<Picker.Item
        key={i}
        label={program}
        value={program} />)
    });
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.1 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.titleText}>
              Ride Tracker
            </Text>
          </View>

          <View style={{ flex: 0.1 }} />

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text
                onPress={this.updateDate}
                style={styles.dateText}>
                {this.state.date.displayDate}
              </Text>
              <Text
                onPress={this.updateTime}
                style={styles.dateText}>
                {this.state.date.displayTime}
              </Text>
            </View>

            <View style={{ flex: 0.1 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Hoshi
                borderColor={'#4359e8'}
                keyboardType="numeric"
                label={'Weight (lbs)'}
                maxLength={6}
                onChangeText={(text) => this.setState({ weight: text })} //eslint-disable-line  react/no-set-state
                style={{ flex: 0.8, borderWidth: 0, height: 40 }}
              />
            </View>

            <View style={{ flex: 0.1 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <View style={{ flex: 0.1 }} />
              <Text
                style={styles.labelText2}>
                Program: {this.state.program}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Picker
                onValueChange={(itemValue, itemIndex) => this.setState({ program: itemValue })} //eslint-disable-line  react/no-set-state
                selectedValue={this.state.program}
                style={{ flex: 0.8, borderWidth: 0, height: 30 }}>
                {programPickerItems}
              </Picker>
            </View>

            <View style={{ flex: 0.1 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <View style={{ flex: 0.1 }} />
              <Text
                style={styles.labelText2}>
                Level: {this.state.level}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Slider
                maximumValue={20}
                minimumValue={1}
                onValueChange={(val) => this.setState({ level: val })} //eslint-disable-line  react/no-set-state
                step={1}
                style={{ flex: 0.8, borderWidth: 0, height: 40 }}
                value={this.state.defaultLevel}
              />
            </View>

            <View style={{ flex: 0.1 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={this.startRide}
                style={styles.button}
                testID="startRideButton">
                <Text style={styles.buttonText}>
                  Start Ride!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    );
  }
}

AddRideScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func
  }).isRequired
};