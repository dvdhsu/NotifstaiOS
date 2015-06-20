module.exports = EventInfo;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Moment = require('moment');
var HumanizeDuration = require('humanize-duration');
var Icon = require('FAKIconImage');

var ajax = require('../lib/ajax.ios');

var Line = require('../lib/line.ios');

var Channel = require('./channel.ios');

var {
  SwitchIOS,
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
      latitude: Number(e.latitude),
      longitude: Number(e.longitude),
      latitudeDelta: .0035,
      longitudeDelta: .003,
      title: this.props.event.name,
      subtitle: this.props.event.address,
    };

    var startTime = Moment(this.props.event.start_time);
    var endTime = Moment(this.props.event.end_time);

    var delta = HumanizeDuration(endTime.diff(startTime));

    if (this.props.event.facebook_url) {
      var facebook_url = this.props.event.facebook_url.replace(/https?:\/\//, "").replace("www.", "")
      var facebook_url_info =
        <View>
          <Line style={styles.line}/>
          <View style={styles.row}>
            <Icon name='ion|social-facebook-outline' size={25} color='#8c8c8c' style={styles.informationIcon} />
            <TouchableOpacity onPress={() => LinkingIOS.openURL(this.props.event.facebook_url)}>
              <Text style={[styles.information, {color: '#fd474c'}]}> {facebook_url} </Text>
            </TouchableOpacity>
          </View>
        </View>
    }

    if (this.props.event.website_url) {
      var event_url = this.props.event.website_url.replace(/https?:\/\//, "").replace("www.", "")
      var event_url_info =
        <View>
          <Line style={styles.line}/>
          <View style={styles.row}>
            <Icon name='ion|link' size={25} color='#8c8c8c' style={styles.informationIcon} />
            <TouchableOpacity onPress={() => LinkingIOS.openURL(this.props.event.website_url)}>
              <Text style={[styles.information, {color: '#fd474c'}]}> {event_url} </Text>
            </TouchableOpacity>
          </View>
        </View>
    }

    return(
      <ScrollView style={styles.container}
        contentContainerStyle={{alignItems: 'center'}}>
        <View style={styles.coverPhotoContainer}>
          <Image source={{uri: this.props.event.cover_photo_url}} style={styles.coverPhoto}>
            <View style={styles.coverPhotoInside}>
              <Text style={styles.eventName}> {this.props.event.name} </Text>
            </View>
          </Image>
        </View>
        <View style={styles.row}>
          <Text style={[styles.information, styles.description]}> {this.props.event.description} </Text>
        </View>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Icon name='ion|ios-bell-outline' size={25} color='#8c8c8c' style={styles.informationIcon} />
          <SwitchIOS value={this.props.subscribed} onValueChange={this.props.subscribeMethod}
            style={{alignSelf: 'flex-end'}}/>
        </View>
        <Line style={styles.line}/>
        <View style={styles.row}>
          <Icon name='ion|ios-calendar-outline' size={25} color='#8c8c8c' style={styles.informationIcon} />
          <Text style={styles.information}> {startTime.format('dddd, MMMM Do, h:mm a')} </Text>
        </View>
        <Line style={styles.line}/>
        <View style={styles.row}>
          <Icon name='ion|ios-clock-outline' size={25} color='#8c8c8c' style={styles.informationIcon} />
          <Text style={styles.information}> {delta} long, ending at {endTime.format('h:mm a')}  </Text>
        </View>
        {facebook_url_info}
        {event_url_info}
        <Line style={styles.line}/>
        <View style={styles.row}>
          <Icon name='ion|ios-navigate-outline' size={25} color='#8c8c8c' style={styles.informationIcon} />
          <TouchableOpacity onPress={() => this._linkToMap(this.props.event.address)}>
            <Text style={[styles.information, {color: '#fd474c'}]}> {this.props.event.address} </Text>
          </TouchableOpacity>
        </View>
        <MapView style={styles.map} annotations={[region]} region={region} showUserLocation={true}
          scrollEnabled={false} />
      </ScrollView>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'row',
    paddingBottom: 80,
    backgroundColor: '#F5F6F5',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    width: width,
    paddingVertical: 8,
    flex: 1,
    paddingHorizontal: 30,
  },
  information: {
    paddingTop: 5,
    fontWeight: '400',
    fontFamily: 'Avenir Next',
    fontSize: 15,
    flex: 1,
    textAlign: 'right',
  },
  description: {
    marginRight: 8,
    textAlign: 'center',
    fontWeight: '500',
    flex: 1,
  },
  informationIcon: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  coverPhotoContainer: {
    paddingBottom: 10,
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
  map: {
    marginTop: 10,
    width: width,
    height: 300,
  },
  navigationButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'black',
    width: width - 30,
    height: 50,
    textAlign: 'center',
  },
  line: {
    width: width - 30,
    backgroundColor: '#cccccc',
  },
});
