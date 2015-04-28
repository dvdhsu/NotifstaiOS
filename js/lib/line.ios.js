'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View
} = React;


/**
 * Simple line
 * can be customized using style
*/
var Line = React.createClass({
    propTypes:{
        style: View.propTypes.style,
    },
  render: function() {
    return (
      <View style={[styles.line, this.props.style]} />
    );
  }
});

var styles = StyleSheet.create({
  line: {
    height: 1,
    alignSelf: 'center',
    backgroundColor: '#cccccc',
  },
});

module.exports = Line;
