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
} = React;

var Login = require('./login.ios');
var Event = require('./event.ios');
var EventList = require('./eventList.ios');

class NotifstaLaunch extends React.Component {

  renderScene(route, nav) {
    switch(route.id) {
      case 'Login':
        return <Login navigator={nav}/>;
      case 'Event':
        return <Event navigator={nav} email={route.email} event={route.event}
                 token={route.token} />
      case 'EventList':
        return <EventList navigator={nav} email={route.email} token={route.token} events={route.events}/>
    }
  }

  render() {
    return(
      <React.Navigator
        style={styles.container}
        sceneStyle={styles.sceneStyle}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        initialRoute={{id: 'Login'}}
        renderScene={this.renderScene}
      />
    );
  }
}

var styles = React.StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: '#FE6F5E',
  },
});

AppRegistry.registerComponent('NotifstaReact', () => NotifstaLaunch);
