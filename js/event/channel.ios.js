module.exports = Channel;

'use strict';

var React = require('react-native');

var Dimensions = require('Dimensions');
var Moment = require('moment');

var Line = require('../lib/line.ios');
var ajax = require('../lib/ajax.ios');

var {width, height} = Dimensions.get('window');

var {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
} = React;

class Channel extends React.Component {
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource({
      rowHasChanged: ((r1, r2) => r1.id != r2.id)
    });

    var notificationsWithTime =
      this._extendNotificationsWithTime(this.props.channel.notifications);

    this.state = {
      dataSource: dataSource.cloneWithRows(notificationsWithTime),
      notifications: notificationsWithTime,
    };

    this._getNotifications();

    Moment.locale('en', {
        relativeTime : {
            future: "in %s",
            past:   "%s",
            s:  "now",
            m:  "a minute ago",
            mm: "%d minutes ago",
            h:  "an hour ago",
            hh: "%d hours ago",
            d:  "a day ago",
            dd: "%d days ago",
            M:  "a month ago",
            MM: "%d months ago",
            y:  "a year ago",
            yy: "%d years ago"
        }
    });
  };

  componentWillMount() {
    PushNotificationIOS.addEventListener('notification', this._handleNotification.bind(this));
    //setInterval(this._updateTimes.bind(this), 60000);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this._handleNotification);
  }

  _handleNotification(notification) {
    if (notification.$PushNotificationIOS_data.channel == this.props.channel.guid) {
      this._getNotifications();
    }
  }

  _getNotifications() {
    var response = ajax.getNotifications(this.props.email, this.props.token, this.props.channel.id)
    response.then((data) => {
      if (data && data.status == "success") {
        var notificationsWithTime = this._extendNotificationsWithTime(data.data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(notificationsWithTime),
          notifications: notificationsWithTime,
        });
      }
    }).done();
  }

  _extendNotificationsWithTime(notifications) {
    notifications.map((n) => {
      var staticTime = Moment(n.created_at);

      n.relativeTime = Moment(n.created_at).fromNow();
      n.staticTimeString = staticTime.format('ddd, h:mm a');
    })
    return notifications;
  }

  _updateTimes() {
    var notificationsWithUpdatedTimes =
      this._extendNotificationsWithTime(this.state.notifications);
    this.setState({
      notifications: notificationsWithUpdatedTimes,
      dataSource: this.state.dataSource.cloneWithRows(notificationsWithUpdatedTimes)
    });
  }

  _renderNotification(notification) {
    return(
      <View>
        <View style={styles.notification} key={notification.id}>
          <Text style={styles.notificationTime}> {notification.staticTimeString} </Text>
          <Text style={styles.notificationGuts}> {notification.notification_guts} </Text>
        </View>
        <Line style={styles.line}/>
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
    return(
      <View style={styles.container}>
        <ListView
          pageSize={100}
          style={styles.channel}
          dataSource={this.state.dataSource}
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
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  notificationGuts: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  notificationTime: {
    color: 'black',
    fontSize: 15,
    fontFamily: 'Avenir Next',
    fontWeight: '400',
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    paddingTop: 30,
    fontWeight: '600',
    fontSize: 30,
    fontFamily: 'Avenir Next',
    alignSelf: 'center',
    flex: 1,
    paddingBottom: 15,
  },
  container: {
    height: height,
    width: width,
    paddingHorizontal: 10,
    backgroundColor: '#F5F6F5',
    paddingBottom: 80,
  },
  line: {
    width: width - 30,
    backgroundColor: '#167ac6',
  },
});
