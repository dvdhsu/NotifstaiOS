module.exports = Login;

'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var Dimensions = require('Dimensions');

var ajax = require('./lib/ajax.ios');

var {width, height} = Dimensions.get('window');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Component
} = React;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'admin@example.com',
      password: 'asdf',
    }
  }

  onEmailChange(event){
    this.setState({
      email: event.nativeEvent.text
    })
  }

  onPasswordChange(event){
    this.setState({
      password: event.nativeEvent.text
    });
  }

  login() {
    var loginData = ajax.login(this.state.email, this.state.password);
    loginData.then(
      (data) => {
        if (data.status === 'failure') {
          // do some animation here, or display a message
        }
        else if (data.status === 'success') {
          this.props.navigator.push({
            id: 'EventList',
            events: data.data.events,
            email: data.data.email,
            token: data.data.authentication_token,
          });
        }
      }
    ).catch((err) => console.log('error ' + err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon
          name='ion|social-windows'
          size={40}
          color='black'
          style={styles.windows}
        />
        <View style={styles.loginFieldRow}>
          <TextInput style={styles.loginInput} value='admin@example.com'
            autoFocus={true} onChange={this.onEmailChange.bind(this)}
            keyboardType='email-address' placeholder='Email'
            autoCapitalize='none' autoCorrect={false} returnKeyType='next'/>
        </View>
        <View style={styles.loginFieldRow}>
          <TextInput style={styles.loginInput} value='asdf'
          onChange={this.onPasswordChange.bind(this)} password={true}
          placeholder='Password' autoCapitalize='none' autoCorrect={false}
          returnKeyType='go'/>
        </View>
        <TouchableHighlight underlayColor='black' onPress={this.login.bind(this)}>
          <Text> Go! </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#87CEEB',
  },
  title: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  loginInput: {
    height: 50,
    paddingLeft: 10,
    marginRight: 5,
    marginBottom: 25,
    fontSize: 18,
    borderWidth: 1,
    flex: 1,
  },
  loginFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  windows: {
      width: 70,
      height: 70,
      margin: 10
    },
});
