import React from 'react';
import { StyleSheet, StatusBar, View} from 'react-native';
import MainScreen from './Components/MainScreen';
import CodeEnter from './Components/CodeEnter';

//Set state testView of MapScreen Component to false to use real location instead of draggable marker
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navState: "code",
      markers: null,
      code: null
    }
  }

  //handles code submission to fetch markers and prepares components for map rendering
  submitCode = (curCode) => {
    let curMarkers = this.fetchMarkers(curCode);
    this.setState({code: curCode}, () => {
      this.setState({markers: curMarkers}, () => {
        this.setState({navState: "main"})
      })
    })
  }

  //Retrieves markers using code. In the future this will change to an api call
  fetchMarkers = (curCode) => {
    let realMarkers = null;

    if(curCode == '12') {
      realMarkers = EXAMPLE_MARKERS;

    } else if (curCode == '21') {
      realMarkers = EXAMPLE_MARKERS_TWO;
    } else if (curCode == '1131') {
      realMarkers = EXAMPLE_MARKERS_THREE;
    }

    return realMarkers;
  }

  render() {
    return (
        <View style={styles.maincontainer}>
          <StatusBar hidden />
          {this.state.navState == "code"? <CodeEnter submitCode={this.submitCode}/> : <MainScreen markers = {this.state.markers} code = {this.state.code} />}
        </View>
    );
  }
}

/*<Marker.Animated ref={marker => { this.marker = marker }} title={'Current Location'} coordinate={this.state.currentLoc}/>*/

EXAMPLE_MARKERS = [
  {
      id: 0,
      title: 'M1',
      coordinates: {
          latitude: -36.847800,
          longitude: 174.753490
      },
      block: "Home",
      brix: null
  },
  {
      id: 1,
      title: 'M2',
      coordinates: {
          latitude: -36.846410,
          longitude: 174.755000
      },
      block: "Home",
      brix: null
  },
  {
      id: 2,
      title: 'M3',
      coordinates: {
          latitude: -36.847110,
          longitude: 174.753390
      },
      block: "Chardonnay",
      brix: null
  },
  {
      id: 3,
      title: 'M4',
      coordinates: {
          latitude: -36.846555,
          longitude: 174.754100
      },
      block: "Chardonnay",
      brix: null
  }
];

EXAMPLE_MARKERS_TWO = [
  {
      id: 0,
      title: 'M1',
      coordinates: {
          latitude: -36.847800,
          longitude: 174.753490
      },
      block: "Home",
      brix: null
  },
  {
      id: 1,
      title: 'M2',
      coordinates: {
          latitude: -36.846410,
          longitude: 174.755000
      },
      block: "Home",
      brix: null
  },
  {
      id: 2,
      title: 'M3',
      coordinates: {
          latitude: -36.847110,
          longitude: 174.753390
      },
      block: "Chardonnay",
      brix: null
  }
];

EXAMPLE_MARKERS_THREE = [
  {
    id: 0,
    title: '1',
    coordinates: {
        latitude: -36.847800,
        longitude: 174.753490
    },
    block: "Home",
    brix: null
  },
  {
    id: 1,
    title: '2',
    coordinates: {
        latitude: -36.846410,
        longitude: 174.755000
    },
    block: "Home",
    brix: null
  },
  {
    id: 2,
    title: '1',
    coordinates: {
        latitude: -36.847110,
        longitude: 174.753390
    },
    block: "Chardonnay",
    brix: null
  },
  {
    id: 3,
    title: '2',
    coordinates: {
        latitude: -36.847410,
        longitude: 174.754000
    },
    block: "Chardonnay",
    brix: null
  },
  {
    id: 4,
    title: '1',
    coordinates: {
        latitude: -36.846810,
        longitude: 174.754390
    },
    block: "Villa Maria",
    brix: null
  }
];

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  }
});

