module.exports = EventInfo;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Moment = require('moment');

var ajax = require('./ajax.ios');

var Channel = require('./channel.ios');

var {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Component,
  MapView,
  LinkingIOS,
} = React;


var {width, height} = Dimensions.get('window');

class EventInfo extends React.Component {
  _linkToMap(address) {
    address = address.replace(/\s/g, '+');
    var appleMapsLink = `http://maps.apple.com/?q=${address}`;
    var googleMapsLink = `comgooglemaps://?q=${address}`;

    LinkingIOS.canOpenURL(googleMapsLink, (supported) => {
      if (!supported) {
        LinkingIOS.openURL(appleMapsLink);
      } else {
        LinkingIOS.openURL(googleMapsLink);
      }
    });
  }

  render() {
    var region = this.props.event;
    region.latitudeDelta = .005;
    region.longitudeDelta = .005;
    region.latitude = parseFloat(region.latitude)
    region.longitude = parseFloat(region.longitude)

    return(
      <View style={styles.container}>
        <Text> {Moment(this.props.event.start_time).calendar()} </Text>
        <Text> {Moment(this.props.event.end_time).calendar()} </Text>
        <MapView style={styles.map} region={region} scrollEnabled={false} showUserLocation={true}/>
        <TouchableOpacity onPress={() => this._linkToMap(this.props.event.address)}>
          <Text> {this.props.event.address}! </Text>
        </TouchableOpacity>
        <Text> {this.props.event.description}! </Text>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  coverPhoto: {
    height: 300,
    width: width,
  },
  container: {
    width: width,
  },
  map: {
    width: width,
    height: 200,
  },
});
