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

class NotifstaLaunch extends React.Component {

  renderScene(route, nav) {
    switch(route.id) {
      case 'Login':
        return <Login navigator={nav}/>;
      case 'Event':
        console.log("transitioning to event");
        return <Event navigator={nav} email={route.email} token={route.token} eventId={route.eventId}/>
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
    backgroundColor: 'blue',
  },
});

AppRegistry.registerComponent('NotifstaReact', () => NotifstaLaunch);
