'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var { TabBarIOS } = require('react-native-icons');
var TabBarItemIOS = TabBarIOS.Item;

var ajax = require('./lib/ajax.ios');

var EventList = require('./eventList.ios.js');
var Settings = require('./settings.ios.js');

var {width, height} = Dimensions.get('window');

var {
  View,
  StyleSheet,
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
          <View style={styles.container}>
            <EventList navigator={this.props.navigator} email={this.props.email}
            token={this.props.token} events={this.props.events} />
          </View>
        );
      case 'settings':
        return (
          <View style={styles.container}>
            <Settings navigator={this.props.navigator} />
          </View>
        )
      default:
        return( <Text> Nothing to see here. </Text>);
    }
  }

  render() {
    return(
      <TabBarIOS
        tintColor={'#ff5a5f'}>
        selectedTab={this.state.selectedTab}>
        <TabBarItemIOS
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
        </TabBarItemIOS>
        <TabBarItemIOS
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
        </TabBarItemIOS>
      </TabBarIOS>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    marginTop: -20,
  },
})

module.exports = Home;
