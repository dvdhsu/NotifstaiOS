'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var { TabBarIOS } = require('react-native-icons');
var TabBarItemIOS = TabBarIOS.Item;

var ajax = require('../lib/ajax.ios');
var Channel = require('./channel.ios');
var EventInfo = require('./eventInfo.ios');
var Subevent = require('./subevent.ios');
var EventMap = require('./eventMap.ios.js');
var Admin = require('./admin.ios');

var PushSubscriptionManager = require('NativeModules').PushSubscriptionManager;

var {width, height} = Dimensions.get('window');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Component,
  PushNotificationIOS,
  TextInput,
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
        if (data.data.subscription) {
          PushSubscriptionManager.pushSubscribe(this.props.event.channels[0].guid);
          this.setState({
            event: data.data,
            subscribed: true,
          });
        }
        else {
          this.setState({
            event: data.data,
            subscribed: false,
          });
        }
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
          <EventMap eventMapUrl={this.state.event.event_map_url}></EventMap>
        );
      case 'admin':
        return (
          <Admin email={this.props.email} token={this.props.token}
            channelId={this.state.event.channels[0].id}
            transitionToChannels={() => { this.setState({selectedTab: 'notifications'}); }}
          />
        );
      default:
        return( <Text> Nothing to see here. </Text>);
    }
  }

  render() {
    var optionalAdmin = (this.state.event.subscription && this.state.event.subscription.admin) ?
        <TabBarItemIOS
          name="admin"
          iconName={'ion|social-rss-outline'}
          title={'Admin'}
          iconSize={32}
          accessibilityLabel="Admin Tab"
          selected={this.state.selectedTab === 'admin'}
          onPress={() => {
            this.setState({
              selectedTab: 'admin',
            });
          }}>
            {this._renderContent()}
        </TabBarItemIOS> :
        null;

    var optionalMap = this.state.event.event_map_url ?
        <TabBarItemIOS
          name="map"
          iconName={'ion|android-map'}
          title={'Map'}
          iconSize={32}
          accessibilityLabel="Map Tab"
          selected={this.state.selectedTab === 'map'}
          onPress={() => {
            this.setState({
              selectedTab: 'map',
            });
          }}>
            {this._renderContent()}
        </TabBarItemIOS> :
        null;

    var optionalSubevents = optionalSubevents = Object.keys(this.state.event.subevents).length > 0 ?
        <TabBarItemIOS
          name="schedule"
          iconName={'ion|ios-calendar-outline'}
          title={'Schedule'}
          iconSize={32}
          accessibilityLabel="Map Tab"
          selected={this.state.selectedTab === 'schedule'}
          onPress={() => {
            this.setState({
              selectedTab: 'schedule',
            });
          }}>
            {this._renderContent()}
        </TabBarItemIOS> :
        null;

    return(
      <TabBarIOS
        tintColor={'#FF5A5F'}
        selectedTab={this.state.selectedTab}>
        <TabBarItemIOS
          name="info"
          iconName={'ion|ios-information-outline'}
          title={'Info'}
          iconSize={32}
          accessibilityLabel="Info Tab"
          selected={this.state.selectedTab === 'info'}
          onPress={() => {
            this.setState({
              selectedTab: 'info',
            });
          }}>
            {this._renderContent()}
        </TabBarItemIOS>
        <TabBarItemIOS
          name="notifications"
          iconName={'ion|android-notifications-none'}
          title={'Notifications'}
          iconSize={32}
          accessibilityLabel="Notifications Tab"
          selected={this.state.selectedTab === 'notifications'}
          onPress={() => {
            this.setState({
              selectedTab: 'notifications',
            });
          }}>
            {this._renderContent()}
        </TabBarItemIOS>
        {optionalSubevents}
        {optionalMap}
        {optionalAdmin}
      </TabBarIOS>
    )
  }
}

module.exports = Event;
