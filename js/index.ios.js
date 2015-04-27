/** Index of Notifsta **/

'use strict';

var React = require('react-native');

var {
  View,
  AppRegistry,
  Navigator,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  PushNotificationIOS,
} = React;

var LaunchCarousel = require('./launchCarousel.ios.js');
var Login = require('./login.ios');
var Event = require('./event.ios');
var EventList = require('./eventList.ios');

class NotifstaLaunch extends React.Component {

  componentDidMount() {
    // reset badge count
    PushNotificationIOS.getApplicationIconBadgeNumber(
      (num) => PushNotificationIOS.setApplicationIconBadgeNumber(0)
    );
    PushNotificationIOS.addEventListener('notification', this._passNotification);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this._passNotification);
  }

  _passNotification(notification) {
    console.log(notification);
    PushNotificationIOS.getApplicationIconBadgeNumber(
      (num) => PushNotificationIOS.setApplicationIconBadgeNumber(num + 1)
    );
    // pass the notification over to event, so that it can refresh
    // also find some way of displaying the notification...
  }

  renderScene(route, nav) {
    switch(route.id) {
      case 'LaunchCarousel':
        return <LaunchCarousel navigator={nav}/>
      case 'Login':
        return <Login navigator={nav} register={route.register}/>;
      case 'Event':
        return <Event navigator={nav} email={route.email} event={route.event}
                 token={route.token} />;
      case 'EventList':
        return <EventList navigator={nav} email={route.email} token={route.token}
                 events={route.events}/>;
    }
  }

  render() {
    return(
      <React.Navigator
        style={styles.container}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        initialRoute={{id: 'LaunchCarousel'}}
        renderScene={this.renderScene}
      />
    );
  }
}

var styles = React.StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: '#FFFFF0',
  },
});

AppRegistry.registerComponent('NotifstaReact', () => NotifstaLaunch);
