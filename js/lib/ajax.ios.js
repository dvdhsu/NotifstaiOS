/** Contains all AJAX calls
 * for Notifsta. **/

var API_BASE = 'http://api.notifsta.com/v1/';

exports = module.exports = {};

'use strict';

exports.login = function(email, password) {
  requestUrl = API_BASE + 'auth/login/?email=' + email + '&password=' + password;
  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
  )
}

exports.loginWithToken = function(email, token) {
  requestUrl = API_BASE + 'auth/login_with_token/?email=' + email + '&token=' + token;
  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
  )
}

exports.facebookCreateOrLogin = function(email, facebookId, facebookToken) {
  requestUrl = API_BASE + 'auth/facebook/?email=' + email + '&facebook_id=' + facebookId + '&facebook_token=' + facebookToken;

  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
      .then(
        (parsed) => {
          console.log(parsed);
          return parsed;
        }
      )
  )
}

exports.getEvent = function(email, token, eventId) {
  requestUrl = API_BASE + 'events/' + eventId + '/?user_email=' + email + '&user_token=' + token;
  return(
    fetch(requestUrl)
      .then((unparsed) => unparsed.json())
  )
}
