/** A Channel. **/

module.exports = Channel;

'use strict';

var React = require('react-native');

var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

class Channel extends React.Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.channel.notifications)
    };
  };

  renderNotification(notification) {
    return(
      <View>
        <Text> {notification.notification_guts} </Text>
      </View>
    );
  }

  render() {
    return(
      <View style={{width: 320}}>
        <ListView
          style={{padding: 50}}
          dataSource={this.state.dataSource}
          renderRow={this.renderNotification.bind(this)}
        />
     </View>
    )
  }
}
