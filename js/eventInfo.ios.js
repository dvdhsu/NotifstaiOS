module.exports = EventInfo;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Moment = require('moment');
var Icon = require('FAKIconImage');

var ajax = require('./lib/ajax.ios');

var Channel = require('./channel.ios');

var {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
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
    var e = this.props.event;

    var region = {
      latitude: e.latitude,
      longitude: e.longitude,
      latitudeDelta: .005,
      longitudeDelta: .005,
      title: this.props.event.name,
      subtitle: this.props.event.address,
    };

    var navigate = <Icon name='ion|ios-navigate-outline' size={20} color='black' style={styles.informationIcon} />

    var startTime = Moment(this.props.event.start_time);
    var endTime = Moment(this.props.event.end_time);

    var delta = Moment.duration(endTime.diff(startTime)).asHours();

    return(
      <ScrollView style={styles.container}>
        <View style={styles.coverPhotoContainer}>
          <Image source={{uri: this.props.event.cover_photo_url}} style={styles.coverPhoto}>
            <View style={styles.coverPhotoInside}>
              <Text style={styles.eventName}> {this.props.event.name} </Text>
            </View>
          </Image>
        </View>
        <Text style={styles.informationTitle}>Welcome!</Text>
        <Text style={styles.description}> {this.props.event.description} </Text>
        <Text style={styles.informationTitle}>When?</Text>
        <View style={styles.row}>
          <Icon name='ion|ios-calendar-outline' size={20} color='black' style={styles.informationIcon} />
          <Text style={styles.information}> {startTime.format("dddd, MMMM Do, h:mm a")} </Text>
        </View>
        <View style={styles.row}>
          <Icon name='ion|ios-clock-outline' size={20} color='black' style={styles.informationIcon} />
          <Text style={styles.information}> {delta} hours long, ending at {endTime.format("h a")}  </Text>
        </View>
        <Text style={styles.informationTitle}>Where?</Text>
        <View style={styles.row}>
          {navigate}
          <TouchableOpacity onPress={() => this._linkToMap(this.props.event.address)}>
            <Text style={styles.information}> {this.props.event.address} </Text>
          </TouchableOpacity>
        </View>
        <MapView style={styles.map} annotations={[region]} region={region} showUserLocation={true} />
        <MapView style={styles.map} annotations={[region]} region={region} showUserLocation={true}
          scrollEnabled={false}/>
      </ScrollView>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'column',
    paddingBottom: 100,
    backgroundColor: '#FFFFF0',
  },
  map: {
    width: width,
    height: 200,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    alignSelf: 'center',
  },
  information: {
    paddingTop: 3,
    fontWeight: "400",
    fontFamily: 'Palatino',
  },
  informationIcon: {
    width: 20,
    height: 20,
  },
  informationTitle: {
    fontWeight: "800",
    fontSize: 25,
    fontFamily: 'Palatino',
    alignSelf: 'center',
    flex: 1,
    padding: 10,
    paddingTop: 15,
  },
  description: {
    fontWeight: "400",
    padding: 10,
    fontSize: 15,
    fontFamily: 'Palatino',
    alignSelf: 'center',
    flex: 1,
    textAlign: 'center',
  },
  coverPhotoContainer: {
    paddingBottom: 20,
  },
  coverPhoto: {
    width: width,
    height: height / 1.9,
    backgroundColor: 'transparent',
  },
  eventName: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'Avenir Next',
    fontWeight: '700',
    textAlign: 'center',
  },
  coverPhotoInside: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
});
