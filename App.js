import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import MainScreen from './Components/MainScreen'

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        
        <MainScreen />
    );
  }
}

/*<Marker.Animated ref={marker => { this.marker = marker }} title={'Current Location'} coordinate={this.state.currentLoc}/>*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

