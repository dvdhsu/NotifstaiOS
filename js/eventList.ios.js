module.exports = EventList;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Geolib = require('geolib');
var Moment = require('moment');

var _ = require('underscore');
var PushSubscriptionManager = require('NativeModules').PushSubscriptionManager;

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

    var dataSource = new ListView.DataSource({
      rowHasChanged: ((r1, r2) => r1 !== r2),
      sectionHeaderHasChanged: ((h1, h2) => h1 !== h2),
    });

    var subscribedEventsWithTime = this._extendEventsWithTime(this.props.events.subscribed);
    var unsubscribedEventsWithTime = this._extendEventsWithTime(this.props.events.not_subscribed);

    subscribedEventsWithTime = subscribedEventsWithTime.map(
      (e) => {
        PushSubscriptionManager.pushSubscribe(e.channels[0].guid);
        e.subscribed = true;
        return e; 
      }
    )

    unsubscribedEventsWithTime = unsubscribedEventsWithTime.map(
      (e) => { e.subscribed = false; return e; }
    )

    // do not display unpublished events
    unsubscribedEventsWithTime = unsubscribedEventsWithTime.filter(
      (e) => { return e.published }
    );

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections({
        "Your Events": subscribedEventsWithTime,
        "All Events": unsubscribedEventsWithTime
      }),
      subscribedEvents: subscribedEventsWithTime,
      unsubscribedEvents: unsubscribedEventsWithTime,
    }
  }

  componentWillUnmount() {
    //navigator.geolocation.clearWatch(this.watchID);
  }

  componentWillMount() {
/**
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(
            this._extendEventsWithDistance(pos.coords, this.props.events)
          )
        })
      }
    );

    this.props.watchID = navigator.geolocation.watchPosition(
      (pos) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(
            this._extendEventsWithDistance(pos.coords, this.props.events)
          )
        })
      }
    ) **/
  }

  _extendEventsWithDistance(coords, events) {
    events.map((e) => {
      var distance = Geolib.getDistance(coords, e, 100);
      e.relativeDistance = (distance / 1000).toString() + 'km away';
    })
    return events;
  }

  _extendEventsWithTime(events) {
    events.map((e) => {
      e.relativeTime = Moment(e.start_time).fromNow();
    })
    return events;
  }

  updateSubscriptions(wasSubscribed, eventId) {
    if (wasSubscribed) {
      var [newSubscribed, toUnsubscribe] = _.partition(this.state.subscribedEvents, (e) => e.id != eventId);
      var newUnsubscribed = this.state.unsubscribedEvents;
      newUnsubscribed.push(toUnsubscribe[0]);
    } else {
      var [newUnsubscribed, toSubscribe] = _.partition(this.state.unsubscribedEvents, (e) => e.id != eventId);
      var newSubscribed = this.state.subscribedEvents;
      newSubscribed.push(toSubscribe[0]);
    }
    console.log(newUnsubscribed);
    console.log(newSubscribed);
    var subscribedEventsWithTime = this._extendEventsWithTime(newSubscribed);
    var unsubscribedEventsWithTime = this._extendEventsWithTime(newUnsubscribed);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections({
        "Your Events": subscribedEventsWithTime,
        "All Events": unsubscribedEventsWithTime
      }),
      subscribedEvents: subscribedEventsWithTime,
      unsubscribedEvents: unsubscribedEventsWithTime,
    })
  }

  _renderEvent(event) {
    return(
      <TouchableOpacity onPress={() => this._transitionToEvent(event)} key={event.id} activeOpacity={.9}>
        <Image source={{uri: event.cover_photo_url}} style={styles.coverPhoto}>
          <View style={styles.event}>
            <Text style={[styles.eventName, styles.eventText]}> {event.name} </Text>
            <Text style={[styles.eventInfo, styles.eventText]}> {event.address} </Text>
            <Text style={[styles.eventInfo, styles.eventText]}> {event.relativeTime} </Text>
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
      updateSubscriptions: this.updateSubscriptions.bind(this),
      id: 'EventNavigator',
    });
  }

  _renderSectionHeader(data, section) {
    return(
      <View style={styles.sectionHeader}>
        <Text style={styles.headerText}> {section.toString()} </Text>
      </View>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <ListView
          style={styles.eventList}
          dataSource={this.state.dataSource}
          renderRow={this._renderEvent.bind(this)}
          renderSectionHeader={this._renderSectionHeader}
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#F5F6F5',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#82898D',
    borderWidth: 1,
    height: 45,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 22,
    fontFamily: 'Avenir Next',
  },
  title: {
    textAlign: 'center',
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
    color: 'black',
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
