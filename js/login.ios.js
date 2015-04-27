module.exports = Login;

'use strict';

var React = require('react-native');
var Icon = require('FAKIconImage');
var Dimensions = require('Dimensions');

var ajax = require('./lib/ajax.ios');

var {width, height} = Dimensions.get('window');

var NSUserDefaults = require('NativeModules').UserDefaultsManager;

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Component,
  VibrationIOS,
} = React;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
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
    var loginData = this.props.register ? ajax.register(this.state.email, this.state.password) :
      ajax.login(this.state.email, this.state.password);
    loginData.then(
      (data) => {
        if (data.status === 'failure') {
          this.setState({
            error: 'Invalid email or password.',
          });
          VibrationIOS.vibrate();
        }
        else if (data.status === 'success') {
          VibrationIOS.vibrate();
          // set for future logins
          NSUserDefaults.storeString("email", data.data.email);
          NSUserDefaults.storeString("token", data.data.authentication_token);
          this.props.navigator.push({
            id: 'EventList',
            events: data.data.events,
            email: data.data.email,
            token: data.data.authentication_token,
          });
        }
      }
    ).catch((err) =>  {
      this.setState({
        error: "No internet connection."
      });
    });
  }

  render() {
    var loginButtonText = this.props.register ? "Sign up" : "Login";
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={false}
        bounces={false} keyboardDismissMode='onDrag'>
        <TouchableHighlight style={[styles.closeIcon, styles.closeButton]}
          onPress={this.props.navigator.pop}>
          <Icon name='ion|ios-close-empty' size={50} color='black' style={styles.closeIcon} />
        </TouchableHighlight>
        <Text style={styles.title}>{loginButtonText}</Text>
        <Text style={styles.error}>{this.state.error}</Text>
        <View style={styles.loginFieldRow}>
          <TextInput style={styles.loginInput}
            autoFocus={true} onChange={this.onEmailChange.bind(this)}
            keyboardType='email-address' placeholder='Email'
            autoCapitalize='none' autoCorrect={false} returnKeyType='next'
            onSubmitEditing={() => this.refs["password"].focus()}
            onFocus={() => this.setState({error: ''})}/>
        </View>
        <View style={styles.loginFieldRow}>
          <TextInput style={styles.loginInput} ref="password"
          onChange={this.onPasswordChange.bind(this)} password={true}
          placeholder='Password' autoCapitalize='none' autoCorrect={false}
          returnKeyType='go' onSubmitEditing={() => this.login()}
          onFocus={() => this.setState({error: ''})}/>
        </View>
        <TouchableHighlight style={styles.loginButton}
          underlayColor='black' onPress={() => this.login()}>
          <Text style={styles.loginButtonText}> {loginButtonText} </Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#FD464D',
    alignItems: 'center',
  },
  loginInput: {
    height: 50,
    paddingLeft: 10,
    marginRight: 5,
    marginBottom: 25,
    fontSize: 40,
    borderWidth: 1,
    borderRadius: 2,
    flex: 1,
    fontFamily: 'Palatino',
    fontWeight: '600',
  },
  loginFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  windows: {
    width: 100,
    height: 100,
    margin: 10
  },
  loginButton: {
    width: 150,
    height: 50,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
  },
  loginButtonText: {
    paddingTop: 7,
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'Avenir Next',
    flex: 1,
    textAlign: 'center',
  },
  error: {
    padding: 5,
    fontSize: 20,
    fontFamily: 'Avenir Next',
    textAlign: 'center',
  },
  title: {
    paddingTop: 10,
    fontSize: 35,
    fontWeight: '600',
    fontFamily: 'Avenir Next',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    height: 50,
    width: 50,
  },


});
