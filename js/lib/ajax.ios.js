/** Contains all AJAX calls
 * for Notifsta. **/

var API_BASE = 'http://api.notifsta.com/v1/';

exports = module.exports = {};

'use strict';

var React = require('react-native');

var {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  AlertIOS,
} = React;

exports.login = function(email, password) {
  requestUrl = API_BASE + 'auth/login/?email=' + email + '&password=' + password + '&ios=true';
  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
  )
}

exports.register = function(email, password) {
  requestUrl = API_BASE + 'auth/register/?email=' + email + '&password=' + password + '&ios=true';
  return(
    fetch(requestUrl, { method: 'post' })
      .then((unparsed) => unparsed.json())
  )
}

exports.loginWithToken = function(email, token) {
  requestUrl = API_BASE + 'auth/login_with_token/?email=' + email + '&token=' + token + '&ios=true';
  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
  )
}

exports.facebookCreateOrLogin = function(email, facebookId, facebookToken) {
  requestUrl = API_BASE + 'auth/facebook/?email=' + email + '&facebook_id=' + facebookId + '&facebook_token=' + facebookToken + '&ios=true';

  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
      .then((parsed) => {
        return parsed;
      })
      .catch((error) => {
        AlertIOS.alert('No internet connection');
      })
  )
}

exports.getEvent = function(email, token, eventId) {
  requestUrl = API_BASE + 'events/' + eventId + '/?user_email=' + email + '&user_token=' + token;
  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
      .catch((error) => {
        AlertIOS.alert('Cannot update event - no internet connection');
      })
  )
}

exports.getNotifications = function(email, token, channelId) {
  requestUrl = API_BASE + 'channels/' + channelId + '/notifications/?user_email=' + email + '&user_token=' + token;
  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
      .catch((error) => {
        AlertIOS.alert('Cannot update notifications - no internet connection');
      })
  )
}

exports.subscribe = function(email, token, eventId) {
  requestUrl = API_BASE + 'subscriptions/?user_email=' + email + '&user_token=' + token + '&event_id=' + eventId;
  return(
    fetch(requestUrl, { method: 'post' })
      .then((unparsed) => unparsed.json())
      .catch((error) => {
        AlertIOS.alert('Cannot subscribe - no internet connection.');
      })
  )
}

exports.unsubscribe = function(email, token, eventId) {
  requestUrl = API_BASE + '/events/' + eventId + '/subscription/?user_email=' + email + '&user_token=' + token;
  return(
    fetch(requestUrl, { method: 'delete' })
      .then((unparsed) => unparsed.json())
      .catch((error) => {
        AlertIOS.alert('Cannot unsubscribe - no internet connection.');
      })
  )
}
