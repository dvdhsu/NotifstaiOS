module.exports = Home;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var SMXTabBarIOS = require('SMXTabBarIOS');
var SMXTabBarItemIOS = SMXTabBarIOS.Item;

var ajax = require('./lib/ajax.ios');

var EventList = require('./eventList.ios.js');
var Settings = require('./settings.ios.js');

var {width, height} = Dimensions.get('window');

var {
  View,
  Component,
  Image,
} = React;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'myEvents',
    }
  }

  _renderContent() {
    switch(this.state.selectedTab) {
      case 'myEvents':
        return (
          <EventList navigator={this.props.navigator} email={this.props.email}
            token={this.props.token} events={this.props.events} />
        );
      case 'settings':
        return (
          <Settings navigator={this.props.navigator} />
        )
      default:
        return( <Text> Nothing to see here. </Text>);
    }
  }

  render() {
    return(
      <SMXTabBarIOS
        selectedTab={this.state.selectedTab}>
        <SMXTabBarItemIOS
          name="myEvents"
          iconName={'ion|ios-home-outline'}
          title={''}
          iconSize={32}
          accessibilityLabel="Event Tab"
          selected={this.state.selectedTab === 'myEvents'}
          onPress={() => {
            this.setState({
              selectedTab: 'myEvents',
            });
          }}>
            {this._renderContent()}
        </SMXTabBarItemIOS>
        <SMXTabBarItemIOS
          name="settings"
          iconName={'ion|ios-cog-outline'}
          title={''}
          iconSize={32}
          accessibilityLabel="Settings Tab"
          selected={this.state.selectedTab === 'settings'}
          onPress={() => {
            this.setState({
              selectedTab: 'settings',
            });
          }}>
            {this._renderContent()}
        </SMXTabBarItemIOS>
      </SMXTabBarIOS>
    )
  }
}
