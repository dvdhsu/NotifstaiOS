module.exports = Event;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var SMXTabBarIOS = require('SMXTabBarIOS');
var SMXTabBarItemIOS = SMXTabBarIOS.Item;

var ajax = require('./lib/ajax.ios');
var Channel = require('./channel.ios');
var EventInfo = require('./eventInfo.ios');
var Subevent = require('./subevent.ios');

var PushSubscriptionManager = require('NativeModules').PushSubscriptionManager;

var {width, height} = Dimensions.get('window');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Component,
  Image,
  PushNotificationIOS,
} = React;

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.event,
      subscribed: this.props.event.subscribed,
      selectedTab: 'info',
    }
  }

  componentWillMount() {
    this.updateEvent();
    PushNotificationIOS.addEventListener('notification', this._handleNotification.bind(this));
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this._handleNotification);
  }

  _handleNotification(notification) {
    if (notification.$PushNotificationIOS_data.channel == this.state.event.channels[0].guid) {
      this.updateEvent();
    }
  }

  updateEvent() {
    // connect to server and request
    var response = ajax.getEvent(this.props.email, this.props.token, this.props.event.id);
    response.then((data) => {
      if (data && data.status == "success") {
        if (data.data.subscribed) {
          PushSubscriptionManager.pushSubscribe(this.props.event.channels[0].guid);
        }
        this.setState({
          event: data.data,
          subscribed: data.data.subscribed,
        });
      }
    }).done();
  }

  _updateSubscription() {
    if (this.state.subscribed) {
      var response = ajax.unsubscribe(this.props.email, this.props.token, this.props.event.id);
      response.then((data) => {
        if (data && data.status == "success") {
          this.setState({
            subscribed: false,
          });
          PushSubscriptionManager.pushUnsubscribe(this.props.event.channels[0].guid);
          this.props.updateSubscriptions(true, this.props.event.id);
        }
      }).done();
    } else {
      var response = ajax.subscribe(this.props.email, this.props.token, this.props.event.id);
      response.then((data) => {
        if (data && data.status == "success") {
          this.setState({
            subscribed: true,
          });
          PushSubscriptionManager.pushSubscribe(this.props.event.channels[0].guid);
          this.props.updateSubscriptions(false, this.props.event.id);
        }
      }).done();
    }
  }

  _renderContent() {
    switch(this.state.selectedTab) {
      case 'info':
        return (
          <ScrollView>
            <EventInfo event={this.state.event} coverPhoto={this.props.coverPhoto}
              subscribed={this.state.subscribed}
              subscribeMethod={this._updateSubscription.bind(this)}/>
          </ScrollView>
      );
      case 'notifications':
        return (
          <Channel channel={this.state.event.channels[0]}
            email={this.props.email} token={this.props.token} />
        );
      case 'schedule':
        return (
          <Subevent subevents={this.state.event.subevents} />
      );
      case 'map':
        return (
          <ScrollView contentContainerStyle={styles.map}
            maximumZoomScale={2.0}>
            <Image source={{uri: this.state.event.event_map_url}} style={styles.eventMap}
              resizeMode={Image.resizeMode.contain}>
            </Image>
          </ScrollView>
        );
      default:
        return( <Text> Nothing to see here. </Text>);
    }
  }

  render() {
    var optionalMap = this.state.event.event_map_url ?
        <SMXTabBarItemIOS
          name="map"
          iconName={'ion|android-map'}
          title={''}
          iconSize={32}
          accessibilityLabel="Map Tab"
          selected={this.state.selectedTab === 'map'}
          onPress={() => {
            this.setState({
              selectedTab: 'map',
            });
          }}>
            {this._renderContent()}
        </SMXTabBarItemIOS> :
        null;

    var optionalSubevents = optionalSubevents = Object.keys(this.state.event.subevents).length > 0 ?
        <SMXTabBarItemIOS
          name="schedule"
          iconName={'ion|ios-calendar-outline'}
          title={''}
          iconSize={32}
          accessibilityLabel="Map Tab"
          selected={this.state.selectedTab === 'schedule'}
          onPress={() => {
            this.setState({
              selectedTab: 'schedule',
            });
          }}>
            {this._renderContent()}
        </SMXTabBarItemIOS> :
        null;

    return(
      <SMXTabBarIOS
        selectedTab={this.state.selectedTab}>
        <SMXTabBarItemIOS
          name="info"
          iconName={'ion|ios-information-outline'}
          title={''}
          iconSize={32}
          accessibilityLabel="Info Tab"
          selected={this.state.selectedTab === 'info'}
          onPress={() => {
            this.setState({
              selectedTab: 'info',
            });
          }}>
            {this._renderContent()}
        </SMXTabBarItemIOS>
        <SMXTabBarItemIOS
          name="notifications"
          iconName={'ion|android-notifications-none'}
          title={''}
          iconSize={32}
          accessibilityLabel="Notifications Tab"
          selected={this.state.selectedTab === 'notifications'}
          onPress={() => {
            this.setState({
              selectedTab: 'notifications',
            });
          }}>
            {this._renderContent()}
        </SMXTabBarItemIOS>
        {optionalSubevents}
        {optionalMap}
      </SMXTabBarIOS>
    )
  }
}

var styles = StyleSheet.create({
  map: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: -50,
  },
  eventMap: {
    height: height,
  },
});
