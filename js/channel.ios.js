/** A Channel. **/

module.exports = Channel;

'use strict';

var React = require('react-native');

var Dimensions = require('Dimensions');

var {width, height} = Dimensions.get('window');

var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

class Channel extends React.Component {
  constructor(props) {
    super(props);
  };

  renderNotification(notification) {
    return(
      <View style={styles.notification}>
        <Text style={styles.notificationGuts}> {notification.notification_guts} </Text>
      </View>
    );
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: ((r1, r2) => false)
    });
    dataSource = dataSource.cloneWithRows(this.props.channel.notifications)

    return(
      <View style={styles.container}>
        <Text style={styles.title}> {this.props.channel.name} </Text>
        <ListView
          style={styles.channel}
          dataSource={dataSource}
          renderRow={this.renderNotification.bind(this)}
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  notification: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  notificationGuts: {
    textAlign: 'center',
    fontSize: 15,
  },
  channel: {
    flex: 1,
    width: width,
    height: height - 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    paddingBottom: 50,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 20
  },
});
