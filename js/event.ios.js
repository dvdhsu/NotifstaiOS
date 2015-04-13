module.exports = Event;

'use strict';

var React = require('react-native');
var Carousel = require('react-native-carousel');
var Dimensions = require('Dimensions');

var ajax = require('./ajax.ios');
var Channel = require('./channel.ios');
var EventInfo = require('./eventInfo.ios');

var {
  StyleSheet,
  Text,
  View,
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
    if (this.state.channels.length > 0) {
      var channel = <Channel channel={this.state.channels[0]} />
    }
    return (
      <View style={styles.container}>
        <View style={styles.coverPhotoContainer}>
          <Image source={{uri: this.state.cover_photo_url}} style={styles.coverPhoto}>
            <View style={styles.coverPhotoInside}>
              <Text style={styles.eventName}> {this.state.name} </Text>
            </View>
          </Image>
        </View>
        <Carousel indicatorColor="yellow" styles={styles.carousel} width={width}>
          <EventInfo event={this.state}/>
          {channel}
        </Carousel>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FE6F5E',
    paddingBottom: 30,
  },
  coverPhotoContainer: {
    paddingBottom: 20,
  },
  coverPhoto: {
    width: width,
    height: height / 3,
    backgroundColor: 'transparent',
  },
  eventName: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'Avenir Next',
  },
  coverPhotoInside: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingLeft: 10,
  },
});
