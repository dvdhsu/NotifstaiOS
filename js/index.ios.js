/** Index of Notifsta **/

'use strict';

var React = require('react-native');

var {
  AlertIOS,
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


class NotifstaLaunch extends React.Component {

  componentDidMount() {
    // reset badge count
    PushNotificationIOS.addEventListener('notification', this._displayNotification);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this._displayNotification);
  }

  _displayNotification(notification) {
    AlertIOS.alert(notification.$PushNotificationIOS_data.event_name,
                   notification.$PushNotificationIOS_alert);
  }

  renderScene(route, nav) {
    var LaunchCarousel = require('./launchCarousel.ios.js');
    var Login = require('./login.ios');
    var Event = require('./event/event.ios');
    var EventNavigator = require('./event/eventNavigator.ios');
    var EventList = require('./eventList.ios');
    var Home = require('./home.ios');
    switch(route.id) {
      case 'LaunchCarousel':
        return <LaunchCarousel navigator={nav}/>
      case 'Login':
        return <Login navigator={nav} register={route.register}/>;
      case 'Home':
        return <Home navigator={nav} email={route.email} token={route.token}
                 events={route.events}/>;
      case 'EventNavigator':
        return <EventNavigator navigator={nav} email={route.email} event={route.event}
                 token={route.token} updateSubscriptions={route.updateSubscriptions} />;
      case 'Event':
        return <Event navigator={nav} email={route.email} event={route.event}
                 token={route.token} updateSubscriptions={route.updateSubscriptions} />;
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
    backgroundColor: '#F5F6F5',
  },
});

AppRegistry.registerComponent('NotifstaReact', () => NotifstaLaunch);
