'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var { Icon, } = require('react-native-icons');

var Event = require('./event.ios');

var {width, height} = Dimensions.get('window');

var {
  Text,
  View,
  Navigator,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} = React;


class EventNavigator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subscription: this.props.event.subscription,
    }

    // bind this
    var self = this;
    this.routeMapper = {
      LeftButton: function(route, navigator, index, navState) {
        return (
          <TouchableOpacity style={styles.backButton}
            onPress={() => self.props.navigator.pop()}>
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
              Back
            </Text>
          </TouchableOpacity>
        );
      },

      RightButton: function(route, navigator, index, navState) {
        if (route.id != 'Help') {
          return (
            <TouchableOpacity style={styles.backButton}
              onPress={() => navigator.push({
                id: 'Help',
                subscription: route.event.subscription,
                name: route.event.name
              })}>
              <Text style={[styles.navBarText, styles.navBarTitleText]}>
                Help
              </Text>
            </TouchableOpacity>
          );
        }
      },

      Title: function(route, navigator, index, navState) {
        if (route.id == 'Help') {
          return(
            <TouchableOpacity style={styles.backButton}
              onPress={() => navigator.pop()}>
              <Text style={[styles.navBarText, styles.navBarTitleText]}>
                {route.name}
              </Text>
            </TouchableOpacity>
          )
        } else {
          return (
            <TouchableOpacity style={styles.backButton}
              onPress={() => navigator.replace(route)}>
              <Text style={[styles.navBarText, styles.navBarTitleText]}>
                {route.event.name}
              </Text>
            </TouchableOpacity>
          );
        }
      },

    };
  }

  renderScene(route, nav) {
    switch(route.id) {
      case 'Help':
        var currentText = this.state.subscription ?
          <Text style={[styles.helpText]}>
            You are currently
              <Text style={{fontWeight:'700'}}> subscribed </Text>
            to notifications from <Text style={{fontStyle: 'italic'}}>{route.name}</Text>.
          </Text> :
          <Text style={[styles.helpText]}>
            You are currently
              <Text style={{fontWeight:'700'}}> not subscribed </Text>
            to notifications from <Text style={{fontStyle: 'italic'}}>{route.name}</Text>.
          </Text> ;

        var instructionText = this.state.subscription ?
          `To unsubscribe, please disable` :
          `To subscribe, please enable`;

        return(
          <View style={styles.helpContainer}>
            <Text style={[styles.helpText, styles.helpTitle]}>Help</Text>
            {currentText}
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.helpText]}>
                {instructionText}
              </Text>
              <Icon name='ion|ios-bell-outline' size={20} color='#8c8c8c' style={styles.informationIcon} />
            </View>
          </View>
        );
      case 'Event':
        return (
          <Event navigator={nav} email={route.email} event={route.event}
            token={route.token} updateSubscriptions={route.updateSubscriptions} />
        );
    }
  }

  updateSubscriptions(wasSubscbibed, eventId) {
    this.props.updateSubscriptions(wasSubscbibed, eventId);
    if (eventId == this.props.event.id) {
      this.setState({
        subscription: !this.state.subscription,
      });
    };
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
          updateSubscriptions: this.updateSubscriptions.bind(this),
        }}
        renderScene={this.renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={this.routeMapper}
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
    borderBottomColor: '#82898D',
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
  helpContainer: {
    flexDirection: 'column',
    backgroundColor: '#F5F6F5',
    height: height,
    alignItems: 'center',
  },
  helpText : {
    fontFamily: 'Avenir Next',
    alignSelf: 'center',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 15,
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  helpTitle: {
    paddingTop: 30,
    fontWeight: '600',
    fontSize: 30,
  },
  informationIcon: {
    marginTop: 30,
    marginLeft: -20,
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginRight: 35,
  },
});

module.exports = EventNavigator;
