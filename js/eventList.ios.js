module.exports = EventList;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Geolib = require('geolib');

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

class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null
    }
  }

  componentDidMount() {
    navigator.geolocation.watchPosition(
      (pos) => this.setState({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (error) => console.log("error in determining location" + JSON.stringify(error))
    )
  }

  _renderEvent(event) {
    if (this.state.latitude) {
      var distance = geolib.getDistance(this.state, event, 100);
      var distanceView = <Text style={[styles.eventInfo, styles.eventText]}> {distance / 1000} km away </Text>;
    }

    return(
      <TouchableOpacity onPress={() => this._transitionToEvent(event)}
        key={event.id}>
        <Image source={{uri: event.cover_photo_url}} style={styles.coverPhoto}>
          <View style={styles.event}>
            <Text style={[styles.eventName, styles.eventText]}> {event.name} </Text>
            <Text style={[styles.eventInfo, styles.eventText]}> {event.address} </Text>
            {distanceView}
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
      id: 'Event',
    });
  }

  _renderHeader() {
    return(
      <Text style={styles.title}> Events </Text>
    )
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: ((r1, r2) => r1 !== r2)
    });
    dataSource = dataSource.cloneWithRows(this.props.events);

    return(
      <View style={styles.container}>
        <ListView
          style={styles.eventList}
          dataSource={dataSource}
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
    padding: 15,
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
    height: height - 20,
    flexDirection: 'column',
  },
  container: {
    paddingBottom: 20,
    backgroundColor: '#F5F6F5',
  },
});
