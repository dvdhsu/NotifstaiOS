module.exports = Admin;

'use strict';

var React = require('react-native');
var { Icon, } = require('react-native-icons');
var Dimensions = require('Dimensions');

var ajax = require('../lib/ajax.ios');

var {width, height} = Dimensions.get('window');

var {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableHighlight,
  Component,
  VibrationIOS,
} = React;

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationText: null
    }
  }

  onNotificationChange(notification){
    this.setState({
      notificationText: notification.nativeEvent.text
    })
  }

  send() {
    if (!this.state.notificationText) {
      VibrationIOS.vibrate();
      AlertIOS.alert("Can't send blank message.");
    } else {
      var notificationData = ajax.sendNotification(this.props.email, this.props.token,
        this.props.channelId, this.state.notificationText);
      notificationData.then(
        (data) => {
          if (data && data.status === 'failure') {
            VibrationIOS.vibrate();
            AlertIOS.alert("Something was wrong with your message.");
          }
          else if (data.status === 'success') {
            this.props.transitionToChannels();
          }
        }
      )
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={false}
        bounces={false} keyboardDismissMode='onDrag'>
        <Text style={styles.title}>Send New Notification</Text>
        <View style={styles.sendMessageRow}>
            <TextInput style={styles.notificationInput}
              onChange={this.onNotificationChange.bind(this)}
              returnKeyType='send' onSubmitEditing={() => this.send()}
              autoFocus={true} keyboardType='default'
              clearButtonMode='unless-editing'
            />
        </View>
        <TouchableHighlight style={styles.sendButton}
          underlayColor='#889DC8' onPress={() => this.send()}>
          <Text style={styles.sendButtonText}> Send! </Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    paddingHorizontal: 10,
    backgroundColor: '#F5F6F5',
    paddingBottom: 80,
  },
  notificationInput: {
    height: 50,
    paddingLeft: 10,
    marginRight: 5,
    marginBottom: 25,
    fontSize: 25,
    borderWidth: 1,
    borderRadius: 2,
    flex: 1,
    fontFamily: 'Palatino',
    fontWeight: '600',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderTopColor: 'white',
    borderBottomColor: 'pink',
  },
  sendMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  sendButton: {
    width: 150,
    height: 50,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
    alignSelf: 'center',
  },
  sendButtonText: {
    paddingTop: 7,
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'Avenir Next',
    flex: 1,
    textAlign: 'center',
  },
  title: {
    paddingTop: 30,
    fontWeight: '600',
    fontSize: 30,
    fontFamily: 'Avenir Next',
    alignSelf: 'center',
    paddingBottom: 15,
  },
});
