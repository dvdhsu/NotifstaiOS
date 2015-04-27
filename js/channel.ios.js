/** A Channel. **/

module.exports = Channel;

'use strict';

var React = require('react-native');

var Dimensions = require('Dimensions');
var Moment = require('moment');

Moment.locale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        s:  "1s",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1d",
        dd: "%dd",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});

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
        <Text style={styles.notificationTime}> {Moment(notification.created_at).fromNow()} </Text>
        <Text style={styles.notificationGuts}> {notification.notification_guts} </Text>
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
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
  },
  notificationGuts: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Palatino',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  notificationTime: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Palatino',
    fontWeight: '300',
  },
  header: {
    padding: 30,
  },
  title: {
    fontWeight: "800",
    fontSize: 25,
    fontFamily: 'Palatino',
    alignSelf: 'center',
    flex: 1,
    padding: 20,
  },
  container: {
    height: height,
    width: width,
    backgroundColor: '#FFFFF0',
    paddingHorizontal: 10,
  },
});
