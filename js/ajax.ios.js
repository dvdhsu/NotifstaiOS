/** Contains all AJAX calls
 * for Notifsta. **/

var API_BASE = 'http://api.notifsta.com/v1/';

exports = module.exports = {};

'use strict';

exports.login = function(email, password) {
  request_url = API_BASE + 'auth/login/?email=' + email + '&password=' + password;
  return(
    fetch(request_url)
      .then((unparsed) => unparsed.json())
  )
}

exports.getEvent = function(email, token, eventId) {
  request_url = API_BASE + 'events/' + eventId + '/?user_email=' + email + '&user_token=' + token;
  return(
    fetch(request_url)
      .then((unparsed) => unparsed.json())
  )
}
