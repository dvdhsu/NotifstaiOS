module.exports = EventNavigator;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var Event = require('./event.ios');

var {
  Text,
  View,
  Navigator,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} = React;

var routeMapper = {

  LeftButton: function(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={styles.backButton}
        onPress={() => navigator.pop()}>
        <Text style={[styles.navBarText, styles.navBarTitleText]}>
          Back
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return (null);
  },

  Title: function(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={styles.backButton}
        onPress={() => navigator.replace(route)}>
        <Text style={[styles.navBarText, styles.navBarTitleText]}>
          {route.event.name}
        </Text>
      </TouchableOpacity>
    );
  },

};

class EventNavigator extends React.Component {

  renderScene(route, nav) {
    return <Event navigator={nav} email={route.email} event={route.event}
    token={route.token} />;
  }

  render() {
    return(
      <React.Navigator
        style={styles.container}
        initialRoute={{
          email: this.props.email,
          token: this.props.token,
          event: this.props.event,
          id: 'Event',
        }}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={routeMapper}
            style={styles.navBar}
          />
        }
      />
    );
  }
}

var styles = React.StyleSheet.create({
  container: {
    backgroundColor: '#F5F6F5',
    paddingTop: 48,
    marginTop: -20,
  },
  navBar: {
    backgroundColor: '#F5F6F5',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#167ac6',
    borderWidth: 1,
    height: 60,
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    height: 10,
    padding: 20,
  },
  navBarText: {
    color: '#fd474c',
    padding: 15,
    paddingTop: 10,
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Avenir Next',
  },

});
