/** A Channel. **/

module.exports = Channel;

'use strict';

var React = require('react-native');

var Dimensions = require('Dimensions');
var Moment = require('moment');

var {width, height} = Dimensions.get('window');

var {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

class Channel extends React.Component {
  constructor(props) {
    super(props);
  };

  _renderNotification(notification) {
    return(
      <View style={styles.notification}>
        <Text style={styles.notificationGuts}> {notification.notification_guts} </Text>
        <Text style={styles.notificationTime}> {Moment(notification.created_at).fromNow()} </Text>
      </View>
    );
  }

  _renderHeader() {
    return(
      <View style={styles.header}>
        <Text style={styles.title}> Notifications </Text>
      </View>
    )
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: ((r1, r2) => false)
    });
    dataSource = dataSource.cloneWithRows(this.props.channel.notifications)

    return(
      <View style={styles.container}>
        <ListView
          style={styles.channel}
          dataSource={dataSource}
          renderRow={this._renderNotification}
          renderHeader={this._renderHeader}
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  notification: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'pink',
  },
  notificationGuts: {
    color: 'black',
    fontSize: 15,
  },
  notificationTime: {
    color: 'black',
    fontSize: 15,
  },
  header: {
    padding: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 20
  },
  container: {
  },
});
