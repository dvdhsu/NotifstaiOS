module.exports = Settings;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Icon = require('FAKIconImage');

var Line = require('./lib/line.ios');

var NSUserDefaults = require('NativeModules').UserDefaultsManager;

var {
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Component,
  LinkingIOS,
} = React;

var FacebookLoginManager = require('NativeModules').FacebookLoginManager;
var PushSubscriptionManager = require('NativeModules').PushSubscriptionManager;

var {width, height} = Dimensions.get('window');

class Settings extends React.Component {
  _logout() {
    NSUserDefaults.removeKey("email");
    NSUserDefaults.removeKey("token");
    FacebookLoginManager.logout();
    PushSubscriptionManager.pushUnsubscribeAll();
    this.props.navigator.pop();
  }

  render() {
    return(
      <ScrollView style={styles.container} contentContainerStyle={{alignItems: 'center'}}>
        <Text style={styles.title}> Settings </Text>
        <View style={styles.row}>
          <Icon name='ion|paper-airplane' size={25} color='#8c8c8c' style={styles.settingsIcon} />
          <TouchableOpacity onPress={() => LinkingIOS.openURL("mailto:hi@notifsta.com")}>
            <Text style={[styles.settings, {color: '#fd474c'}]}> Get in touch </Text>
          </TouchableOpacity>
        </View>
        <Line style={styles.line}/>
        <View style={styles.row}>
          <Icon name='ion|lock-combination' size={25} color='#8c8c8c' style={styles.settingsIcon} />
          <TouchableOpacity onPress={() => LinkingIOS.openURL("http://notifsta.com/#/privacy")}>
            <Text style={[styles.settings, {color: '#fd474c'}]}> Privacy Policy </Text>
          </TouchableOpacity>
        </View>
        <Line style={styles.line}/>
        <TouchableHighlight style={styles.logoutButton}
          underlayColor='#889DC8' onPress={() => this._logout()}>
          <Text style={styles.logoutButtonText}> Logout </Text>
        </TouchableHighlight>
        <Text style={[styles.title, {fontSize: 20}]}> Version 1.2.0 </Text>
      </ScrollView>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    flexDirection: 'row',
    paddingBottom: 50,
    backgroundColor: '#F5F6F5',
    flex: 1,
  },
  title: {
    paddingTop: 30,
    fontWeight: '600',
    fontSize: 30,
    fontFamily: 'Avenir Next',
    alignSelf: 'center',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    width: width,
    paddingVertical: 8,
    paddingHorizontal: 30,
  },
  logoutButton: {
    marginVertical: 40,
    width: 150,
    height: 50,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
  },
  logoutButtonText: {
    paddingTop: 7,
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'Avenir Next',
    flex: 1,
    textAlign: 'center',
  },
  line: {
    width: width - 30,
    backgroundColor: '#cccccc',
  },
  settings: {
    paddingTop: 5,
    fontWeight: '400',
    fontFamily: 'Avenir Next',
    fontSize: 15,
    flex: 1,
    textAlign: 'right',
  },
  settingsIcon: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
});
