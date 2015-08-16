'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var {width, height} = Dimensions.get('window');

var {
  StyleSheet,
  ScrollView,
  Component,
  Image,
  ActivityIndicatorIOS,
} = React;

class EventMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }

  render() {
    var loadingIndicator = this.state.loading ? <ActivityIndicatorIOS style={styles.loadingIndicator}/> : null;
    return(
      <ScrollView contentContainerStyle={styles.map}
        maximumZoomScale={2.0}>
        {loadingIndicator}
        <Image source={{uri: this.props.eventMapUrl}}
          style={styles.eventMap}
          resizeMode={Image.resizeMode.contain} onLoadEnd={() => this.setState({loading: false})}>
        </Image>
      </ScrollView>
    );
  }
}

var styles = StyleSheet.create({
  map: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: -50,
  },
  eventMap: {
    height: height,
    width: width,
  },
  loadingIndicator: {
    alignSelf: 'center',
    paddingVertical: height / 2,
  },
});

module.exports = EventMap;
