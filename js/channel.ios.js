module.exports = Channel;

'use strict';

var React = require('react-native');

var Dimensions = require('Dimensions');
var Moment = require('moment');

var Line = require('./lib/line.ios');
var ajax = require('./lib/ajax.ios');

Moment.locale('en', {
    relativeTime : {
        future: 'in %s',
        past:   '%s ago',
        s: '%d seconds',
        m:  '1m',
        mm: '%dm',
        h:  '1h',
        hh: '%dh',
        d:  '1d',
        dd: '%dd',
        M:  'a month',
        MM: '%d months',
        y:  'a year',
        yy: '%d years'
    }
});

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
      rowHasChanged: ((r1, r2) => r1 !== r2)
    });
    dataSource = dataSource.cloneWithRows(this.props.channel.notifications)
    this.state = {
      dataSource: dataSource,
    };
    this._getNotifications();
  };

  componentWillMount() {
    PushNotificationIOS.addEventListener('notification', this._handleNotification.bind(this));
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
      if (data) {
        var dataSource = this.state.dataSource.cloneWithRows(data.data);
        this.setState({
          dataSource: dataSource,
        });
      }
    }).done();
  }

  _renderNotification(notification) {
    return(
      <View>
        <View style={styles.notification} key={notification.id}>
          <Text style={styles.notificationTime}> {Moment(notification.created_at).fromNow()} </Text>
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
    padding: 20,
  },
  container: {
    height: height,
    width: width,
    paddingHorizontal: 10,
    backgroundColor: '#F5F6F5',
    paddingBottom: 50,
  },
  line: {
    width: width - 30,
    backgroundColor: '#167ac6',
  },
});
