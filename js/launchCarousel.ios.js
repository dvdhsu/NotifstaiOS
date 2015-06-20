module.exports = LaunchCarousel;

'use strict';

var React = require('react-native');
var Carousel = require('react-native-looped-carousel');

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var FacebookLoginManager = require('NativeModules').FacebookLoginManager;
var NSUserDefaults = require('NativeModules').UserDefaultsManager;

var ajax = require('./lib/ajax.ios');

var {
  Navigator,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Component,
} = React;

class LaunchCarousel extends React.Component {
  componentWillMount() {
    NSUserDefaults.getDoubleString("email", "token",
      (error, data) => {
        if (!error) {
          // managed to get email and token
          var loginData = ajax.loginWithToken(data[0], data[1]);

          loginData.then(data => {
            if (data && data.status === 'failure') {
              // login failed, so animate something
            } else if (data && data.status === 'success') {
              this.props.navigator.push({
                id: 'Home',
                events: data.data.events,
                email: data.data.email,
                token: data.data.authentication_token,
              });
            }
          });
        }
      }
    )
  }

  _loginWithFacebook() {
    FacebookLoginManager.newSession((error, data) => {
      if (error) {
        console.log('error ' + error);
      } else {
        var loginData =
          ajax.facebookCreateOrLogin(data.email, data.userId, data.token);
        loginData.then(data => {
          if (data && data.status === 'failure') {
            // login failed, so animate something
          } else if (data && data.status === 'success') {
            // set for future logins
            NSUserDefaults.storeString("email", data.data.email);
            NSUserDefaults.storeString("token", data.data.authentication_token);
            this.props.navigator.push({
              id: 'Home',
              events: data.data.events,
              email: data.data.email,
              token: data.data.authentication_token,
            });
          }
        });
      }
    });
  }

  _transition(nextScreen) {
    switch(nextScreen) {
      case 'Login':
        this.props.navigator.push({
          id: 'Login',
          register: false,
        });
      case 'Register':
        this.props.navigator.push({
          id: 'Login',
          register: true,
        });
    }
  }

  render() {
    var pages = [
      <View style={styles.image} key={1}>
        <Image style={styles.image} source={{uri: "http://cdn.notifsta.com/images/eiffel7.jpg"}}>
          <View style={styles.headerContainer}>
            <Text style={[styles.text, styles.header]}> Know the venue. </Text>
            <Text style={[styles.text, styles.subheader]}> Bathrooms? Check. </Text>
            <Text style={[styles.text, styles.subheader]}> Food? Check.  </Text>
            <Text style={[styles.text, styles.subheader]}> Drinks? Checkmate.  </Text>
          </View>
        </Image>
      </View>,
      <View style={styles.image} key={2}>
        <Image style={styles.image} source={{uri: "http://cdn.notifsta.com/images/party.jpg"}}>
          <View style={styles.headerContainer}>
            <Text style={[styles.text, styles.header]}> Receive notifications. </Text>
              <Text style={[styles.text, styles.subheader]}> Get in on the action. </Text>
              <Text style={[styles.text, styles.subheader]}> Before anybody else. </Text>
          </View>
        </Image>
      </View>
    ];

    return (
      <View style={styles.container}>
        <Carousel delay={3000} style={styles.carousel}>
          {pages}
        </Carousel>
        <View style={[styles.loginButtonsContainer, styles.loginButtonsContainerTop]}>
          <TouchableHighlight style={[styles.loginButton, styles.topLoginButton]} 
            onPress={() => this._loginWithFacebook()} underlayColor='#3B0B0B'>
            <Text style={styles.loginButtonText}> Login with Facebook</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.loginButtonsContainer}>
          <TouchableHighlight style={[styles.loginButton]} onPress={() => this._transition("Login")}
            underlayColor='#3B0B0B'>
            <Text style={styles.loginButtonText}> Login </Text>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.loginButton]} onPress={() => this._transition("Register")}
            underlayColor='#3B0B0B'>
            <Text style={styles.loginButtonText}> Sign up </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: height,
    flex: 1,
    alignItems: 'center',
  },
  carousel: {
    height: height - 20,
  },
  headerContainer: {
    paddingTop: (height <= 480 ? 50 : height / 5),
  },
  text: {
    fontFamily: 'Avenir Next',
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  header: {
    fontSize: 35,
    fontWeight: '700',
  },
  subheader: {
    fontSize: 25,
    fontWeight: '500',
  },
  loginButtonsContainer: {
    margin: 10,
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    width: width - 20,
    justifyContent: 'space-between',
  },
  loginButtonsContainerTop: {
    bottom: 100,
  },
  loginButton: {
    borderColor: 'white',
    height: 48,
    borderWidth: 1,
    borderRadius: 3,
    flex: 1,
    margin: 4,
  },
  loginButtonText: {
    paddingTop: 5,
    color: 'white',
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'Avenir Next',
    flex: 1,
    textAlign: 'center',
  },
});
