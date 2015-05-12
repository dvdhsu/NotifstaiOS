module.exports = Subevent;

'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var Icon = require('FAKIconImage');
var Moment = require('moment');

var Line = require('../lib/line.ios');

var {
  StyleSheet,
  Text,
  View,
  Component,
  ListView,
} = React;

var {width, height} = Dimensions.get('window');

class Subevent extends React.Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: ((r1, r2) => r1 !== r2),
      sectionHeaderHasChanged: ((h1, h2) => h1 !== h2),
    });

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(this.props.subevents),
    }
  }

  _renderSectionHeader(data, section) {
    var sectionTime = Moment(section);
    var sectionName = sectionTime.format("ddd, hh:mm a");
    return(
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}> {sectionName} </Text>
        <Line style={styles.line}/>
      </View>
    );
  }

  _renderSubevent(s) {
    var startTime = Moment(s.start_time);
    var startTimeText = startTime.format("hh:mm a");
    var endTime = Moment(s.end_time);
    var endTimeText = endTime.format("hh:mm a");

    return(
      <View style={styles.subeventContainer}>
        <View style={styles.subeventRow}>
          <Text style={[styles.subeventText,
            styles.subeventTime, styles.subeventStartTime]}>{startTimeText}</Text>
          <Text style={[styles.subeventText, styles.subeventName]}>{s.name}</Text>
        </View>
        <View style={styles.subeventRow}>
          <Text style={[styles.subeventText,
            styles.subeventTime, styles.subeventEndTime]}>{endTimeText}</Text>
          <View style={styles.subeventRow}>
            <Icon name='ion|ios-location-outline' size={13} color='black' style={styles.locationIcon} />
            <Text style={[styles.subeventText, styles.subeventLocation]}> {s.location} </Text>
          </View>
        </View>
      </View>
    );
  }

  _renderHeader() {
    return(
      <Text style={styles.title}> Schedule </Text>
    );
  }

  render() {
    return(
      <View style={styles.container}>
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader.bind(this)}
          renderRow={this._renderSubevent.bind(this)}
          renderSectionHeader={this._renderSectionHeader}
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    height: height,
    width: width,
    backgroundColor: '#F5F6F5',
    paddingBottom: 80,
  },
  title: {
    paddingBottom: 20,
    paddingTop: 30,
    fontWeight: '600',
    fontSize: 30,
    fontFamily: 'Avenir Next',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
  },
  sectionHeaderContainer: {
    flex: 1,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
    flex: 1,
    fontWeight: '500',
    color: '#167ac6',
  },
  subeventContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  subeventRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  subeventText: {
    fontFamily: 'Avenir Next',
  },
  subeventTime: {
    paddingRight: 20,
  },
  subeventStartTime: {
    fontWeight: "600",
  },
  subeventEndTime: {
    fontWeight: "400",
  },
  subeventName: {
    fontWeight: "700",
    flex: 1,
  },
  subeventLocation: {
    fontWeight: "500",
    flex: 1,
  },
  locationIcon: {
    marginTop: 3,
    height: 13,
    width: 13,
  },
  line: {
    width: width - 30,
    backgroundColor: '#167ac6',
  },
});
