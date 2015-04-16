module.exports = Login;

'use strict';

var React = require('react-native');
var ajax = require('./ajax.ios');

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
      email: "admin@example.com",
      password: "asdf",
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
        if (data.status === "failure") {
          // do some animation here, or display a message
        }
        else if (data.status === "success") {
          this.props.navigator.push({
            id: 'EventList',
            events: data.data.events,
            email: data.data.email,
            token: data.data.authentication_token,
          });
        }
      }
    ).catch((err) => console.log("error " + err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Log in here! </Text>
        <View style={styles.loginFieldRow}>
          <Text style={styles.loginText}> E-mail </Text>
          <TextInput style={styles.loginInput} value='admin@example.com'
           onChange={this.onEmailChange.bind(this)}/>
        </View>
        <View style={styles.loginFieldRow}>
          <Text style={styles.loginText}> Password </Text>
          <TextInput style={styles.loginInput} value='asdf' onChange={this.onPasswordChange.bind(this)}/>
        </View>
        <TouchableHighlight underlayColor='orange' onPress={this.login.bind(this)}>
          <Text> Go! </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 100,
    paddingRight: 30,
    paddingLeft: 30,
    alignItems: 'center',
    backgroundColor: '#FE6F5E',
  },
  loginInput: {
    height: 36,
    paddingLeft: 10,
    marginRight: 5,
    marginBottom: 25,
    flex: 3,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
  },
  loginFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexWrap: 'wrap',
  },
  loginText: {
    flex: 1,
    marginBottom: 25,
    paddingRight: 10,
  }
});
