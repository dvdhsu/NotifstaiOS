module.exports = Event;

'use strict';

var React = require('react-native');
var Carousel = require('react-native-carousel');

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

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelNodes: [],
      eventName: "",
    }
  }

  componentDidMount() {
    // connect to server and request
    var event = ajax.getEvent(this.props.email, this.props.token, this.props.eventId);
    event.then((data) => {
      this.setState({
        channelNodes: data.data.channels,
        eventName: data.data.name
      });
    })
  }

  render() {
    var channels = this.state.channelNodes.map((channel) =>
                                               <Channel channel={channel}/>)
    return (
      <Carousel indicatorColor="yellow" indicatorAtBottom={false}>
        {channels}
      </Carousel>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  text: {
    flex: 1,
  }
});
