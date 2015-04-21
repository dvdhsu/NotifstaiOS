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
  ScrollView,
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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={false}
        bounces={false} keyboardDismissMode='onDrag'>
        <Icon
          name='ion|pizza'
          size={100}
          color='black'
          style={styles.windows}
        />
        <View style={styles.loginFieldRow}>
          <TextInput style={styles.loginInput} value='admin@example.com'
            autoFocus={true} onChange={this.onEmailChange.bind(this)}
            keyboardType='email-address' placeholder='Email'
            autoCapitalize='none' autoCorrect={false} returnKeyType='next'
            onSubmitEditing={() => this.refs["password"].focus()}/>
        </View>
        <View style={styles.loginFieldRow}>
          <TextInput style={styles.loginInput} value='asdf' ref="password"
          onChange={this.onPasswordChange.bind(this)} password={true}
          placeholder='Password' autoCapitalize='none' autoCorrect={false}
          returnKeyType='go' onSubmitEditing={() => this.login()}/>
        </View>
        <TouchableHighlight style={styles.loginButton}
          underlayColor='black' onPress={() => this.login()}>
          <Text style={styles.loginButtonText}> Go! </Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#87CEEB',
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
    width: 100,
    height: 50,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
  },
  loginButtonText: {
    paddingTop: 7,
    color: 'black',
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'Avenir Next',
    flex: 1,
    textAlign: 'center',
  },

});
