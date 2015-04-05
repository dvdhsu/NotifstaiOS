module.exports = Event;

'use strict';

var React = require('react-native');
var Carousel = require('react-native-carousel');
var Dimensions = require('Dimensions');

var ajax = require('./ajax.ios');
var Channel = require('./channel.ios');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;

var {width, height} = Dimensions.get('window');

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelNodes: [],
      eventName: "",
    }
  }

  componentDidMount() {
    this.updateEvent();
  }

  updateEvent() {
    // connect to server and request
    var response = ajax.getEvent(this.props.email, this.props.token, this.props.eventId);
    response.then((data) => {
      this.setState({
        channelNodes: data.data.channels,
        eventName: data.data.name
      });
    }).done();
  }

  render() {
    var channels = this.state.channelNodes.map((channel) =>
                                               <Channel channel={channel}/>)
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.refreshButton} onPress={() => this.updateEvent()}>
          <Text> Update! </Text>
        </TouchableHighlight>
        <Carousel indicatorColor="yellow" styles={styles.carousel} width={width}>
          {channels}
        </Carousel>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  carousel: {
  },
  container: {
    flex: 1,
    backgroundColor: 'pink',
    paddingBottom: 30,
  },
  text: {
    flex: 1,
  },
  refreshButton: {
    paddingRight: 30,
    paddingTop: 30,
    alignItems: 'flex-end',
  },
});
