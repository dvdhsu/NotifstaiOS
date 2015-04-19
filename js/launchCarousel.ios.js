module.exports = LaunchCarousel;

'use strict';

var React = require('react-native');
var Carousel = require('react-native-looped-carousel');

var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

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
  _transition(nextScreen) {
    switch(nextScreen) {
      case 'LoginWithoutFacebook':
        this.props.navigator.push({
          sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
          id: 'Login'
        });
  //    case 'LoginWithFacebook':
   //   case 'Signup:
    }
  }

  render() {
    var pages = [
      <View style={styles.image}>
        <Image style={styles.image} source={{uri: "https://raw.githubusercontent.com/appintheair/react-native-buyscreen/master/Images/screen_3%402x.png"}}>
          <Text style={styles.title}> Know your event. Inside and out. </Text>
        </Image>
      </View>,
      <View style={styles.image}>
        <Image style={styles.image} source={{uri: "https://raw.githubusercontent.com/appintheair/react-native-buyscreen/master/Images/screen_2%402x.png"}}>
          <Text style={styles.title}> Receive notifications. Don't miss that act.</Text>
        </Image>
      </View>
    ];

    return (
      <View style={styles.container}>
        <Carousel delay={2000} style={styles.carousel}>
          {pages}
        </Carousel>
        <View style={[styles.loginButtonsContainer, styles.loginButtonsContainerTop]}>
          <TouchableHighlight style={[styles.loginButton, styles.topLoginButton]} onPress={() => this._transition("LoginWithoutFacebook")}>
            <Text style={styles.loginButtonText}> Login with Facebook</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.loginButtonsContainer}>
          <TouchableHighlight style={[styles.loginButton]} onPress={() => this._transition("LoginWithoutFacebook")}>
            <Text style={styles.loginButtonText}> Login </Text>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.loginButton]} onPress={() => this._transition("LoginWithoutFacebook")}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    height: height - 20,
  },
  title: {
    fontSize: 35,
    fontWeight: '700',
    fontFamily: 'Avenir Next',
    textAlign: 'center',
    color: 'white',
    padding: 30,
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
