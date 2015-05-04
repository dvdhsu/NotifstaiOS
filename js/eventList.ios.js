module.exports = EventList;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Geolib = require('geolib');
var Moment = require('moment');

var ajax = require('./lib/ajax.ios');

var {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Component,
  ListView,
} = React;

var {width, height} = Dimensions.get('window');

Moment.locale('en', {
    relativeTime : {
        future: 'Starts in %s',
        past:   '%s ago',
        s: '%d seconds',
        m:  '1 minute',
        mm: '%d minutes',
        h:  '1 hour',
        hh: '%d hours',
        d:  '1 day',
        dd: '%d days',
        M:  'a month',
        MM: '%d months',
        y:  'a year',
        yy: '%d years'
    }
});

class EventList extends React.Component {
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource({
      rowHasChanged: ((r1, r2) => true)
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.events),
      latitude: null,
      longitude: null
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        var newButActuallyOldEvents = JSON.parse(JSON.stringify(this.props.events));
        this.setState({ 
          dataSource: this.state.dataSource.cloneWithRows(newButActuallyOldEvents),
          latitude: pos.coords.latitude, 
          longitude: pos.coords.longitude,
        })
      },
      (error) => console.log("error in determining location" + JSON.stringify(error))
    );
    this.props.watchID = navigator.geolocation.watchPosition(
      (pos) => {
        var newButActuallyOldEvents = JSON.parse(JSON.stringify(this.props.events));
        this.setState({ 
          dataSource: this.state.dataSource.cloneWithRows(newButActuallyOldEvents),
          latitude: pos.coords.latitude, 
          longitude: pos.coords.longitude,
        })
      },
      (error) => console.log("error in determining location" + JSON.stringify(error))
    )
  }

  _renderEvent(event) {
    var locationString = "Oxford"

    if (this.state.latitude) {
      var distance = geolib.getDistance(this.state, event, 100);
      locationString = locationString + ', ' +  (distance / 1000).toString() + 'km away';
    }

    var timeDiff = Moment(event.start_time).fromNow();

    return(
      <TouchableOpacity onPress={() => this._transitionToEvent(event)}
        key={event.id} activeOpacity={.9}>
        <Image source={{uri: event.cover_photo_url}} style={styles.coverPhoto}>
          <View style={styles.event}>
            <Text style={[styles.eventName, styles.eventText]}> {event.name} </Text>
            <Text style={[styles.eventInfo, styles.eventText]}> {locationString} </Text>
            <Text style={[styles.eventInfo, styles.eventText]}> {timeDiff} </Text>
          </View>
        </Image>
      </TouchableOpacity>
    )
  }


  _transitionToEvent(event) {
    this.props.navigator.push({
      email: this.props.email,
      token: this.props.token,
      event: event,
      id: 'EventNavigator',
    });
  }

  _renderHeader() {
    return(
      <Text style={styles.title}> Events </Text>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <ListView
          style={styles.eventList}
          dataSource={this.state.dataSource}
          renderRow={this._renderEvent.bind(this)}
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 30,
    paddingTop: 10,
    paddingBottom: 10,
    color: 'white',
  },
  eventText: {
    color: 'white',
    fontFamily: 'Avenir Next',
    textAlign: 'center',
  },
  eventName: {
    fontSize: 30,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  eventInfo: {
    fontSize: 15,
    fontWeight: '600',
  },
  coverPhoto: {
    width: width,
    height: height / 1.9,
    backgroundColor: 'transparent',
  },
  event: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  eventList: {
    width: width,
    height: height,
    paddingTop: 20,
    flexDirection: 'column',
  },
  container: {
    backgroundColor: '#F5F6F5',
  },
});
