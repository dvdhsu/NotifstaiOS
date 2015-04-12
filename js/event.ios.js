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
      channels: [],
      name: "",
      cover_photo_url: "",
      start_time: null,
      end_time: null,
      description: "",
      address: "",
      updated_at: null,
    }
  }

  componentDidMount() {
    this.updateEvent();
  }

  updateEvent() {
    // connect to server and request
    var response = ajax.getEvent(this.props.email, this.props.token, this.props.eventId);
    response.then((data) => {
      this.setState(data.data);
    }).done();
  }

  render() {
    var channels = this.state.channels.map((channel) =>
                                               <Channel channel={channel}/>)
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.refreshButton} onPress={() => this.updateEvent()}>
          <Text> Update! </Text>
        </TouchableHighlight>
        <Carousel indicatorColor="yellow" styles={styles.carousel} width={width}>
          {channels}
          <View style={styles.eventInfo}>
            <Text> {this.state.name} </Text>
            <Text> {this.state.cover_photo_url} </Text>
            <Text> {this.state.address} </Text>
          </View>
        </Carousel>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  carousel: {
  },
  eventInfo: {
    width: width,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FE6F5E',
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
