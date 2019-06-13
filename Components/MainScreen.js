import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Vibration, Image} from 'react-native';
import MapScreen from './MapScreen';
import TakeSample from './TakeSample';
import DistanceTracker from './DistanceTracker';
import Notification from './Notification';

EXAMPLE_MARKERS = [
    {
        id: 0,
        title: 'M1',
        coordinates: {
            latitude: -36.843610,
            longitude: 174.750490
        },
        block: "Home",
        brix: null
    },
    {
        id: 1,
        title: 'M2',
        coordinates: {
            latitude: -36.844410,
            longitude: 174.750490
        },
        block: "Home",
        brix: null
    },
    {
        id: 2,
        title: 'M3',
        coordinates: {
            latitude: -36.846410,
            longitude: 174.750390
        },
        block: "Chardonnay",
        brix: null
    },
    {
        id: 3,
        title: 'M4',
        coordinates: {
            latitude: -36.846410,
            longitude: 174.752390
        },
        block: "Chardonnay",
        brix: null
    }
];

export default class MainScreen extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        markers: EXAMPLE_MARKERS,
        curDistances: null,
        brixVals: null,
        menuoption: 'map',
        proximitymarker: null,
        submissionState: 'waiting',
        blockCounts: 0,
        selectedMarker: null,
        notification: false
      }
    }

    componentDidMount() {
        let brixValues = EXAMPLE_MARKERS.map(a => a.brix);
        this.setState({brixVals: brixValues});
    }

    setProximityMarker = (i, name) => {
        let dupe = false;

        if(name == this.state.proximitymarker) {
            dupe = true;
        }

        this.setState({proximitymarker: name},() => {this.openNotification(i, dupe)});
    }

    setDistances = (distances) => {
        this.setState({curDistances: distances});
    }

    setMarker = (markerselect) => {
        this.setState({selectedMarker: markerselect.marker});
    }

    setMarkertoNone = () => {
        this.setState({selectedMarker: null});
    }

    dataSubmit = (enterVal) => {
        
        let newBrixVals = this.state.brixVals;
        let markerNames = this.state.markers.map(a => a.title);
        let valIndex = markerNames.indexOf(enterVal.samplingPoint);

        if(valIndex != -1) {
            if(newBrixVals[valIndex] === null) {
                let newCount = this.state.blockCounts;
                newCount += 1;
                this.setState({blockCounts: newCount})
            }

            newBrixVals[valIndex] = enterVal.brix;
            this.setState({brixVals: newBrixVals})
            this.setState({menuoption: 'map'});
            //console.log(this.state.brixVals);
        } else {
            console.log('Invalid Sampling Point Name')
        }        
    }

    mapNav = () => {
        this.setState({menuoption: 'map'});
    }

    enterNav = () => {
        this.setState({menuoption: 'record'});
    }

    openNotification = (i, dupe) => {
        if(this.state.brixVals[i] == null && !dupe) {
            this.setState({notification: true});
        }
    }

    closeNotification = () => {
        this.setState({notification: false});
    }
  
    render() {
      return (
        <View style={styles.maincontainer}>
            <StatusBar hidden />
            <View style = {{flex: 1, backgroundColor:'black', alignItems:'center'}}>
                <Text style = {{marginTop: 30, color:'white'}}>
                    Home Block {this.state.blockCounts}/3 
                </Text>
            </View>
            <View style = {{flex: 8}}>
                {this.state.brixVals != null ? 
                        <MapScreen 
                            setProximityMarker = {this.setProximityMarker} 
                            setDistances = {this.setDistances} 
                            markerLocations = {this.state.markers} 
                            selectedM = {this.state.selectedMarker} 
                            setMarkertoNone = {this.setMarkertoNone} 
                            brixVals = {this.state.brixVals}
                            openNotification = {this.openNotification}
                        />
                        : null}
                <View>
                    {this.state.curDistances != null ? <DistanceTracker distances = {this.state.curDistances} markers = {this.state.markers} brixVals = {this.state.brixVals} setMarker = {this.setMarker}/> : null}              
                </View>
                <View style = {{position: 'absolute', width:'70%', height:'25%', left:'15%', top:'40%'}}>
                    {
                        this.state.notification ? 
                        <Notification closeNotification = {this.closeNotification} />:
                        null
                    }
                </View>
                <View style = {{position: 'absolute', height:'100%', width: '100%'}}>
                    {this.state.menuoption == 'record' ? <TakeSample samplingpoint = '2' dataSubmit = {this.dataSubmit} proximityMarker = {this.state.proximitymarker} /> : null}
                </View>
            </View>
            <View style = {{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent:'space-evenly'}}>
                <TouchableOpacity style ={{flex: 1, backgroundColor:'black', alignItems:'center'}} >
                    <Image 
                        source = {require('../assets/settings.png')}
                        resizeMode = 'contain'
                        style = {{height: '80%'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style ={{flex: 1, backgroundColor:'black', alignItems:'center'}} onPress = {this.mapNav}>
                    <Image 
                        source = {require('../assets/viewmap.png')}
                        resizeMode = 'contain'
                        style = {{height: '80%'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style ={{flex: 1, backgroundColor:'black', alignItems:'center'}} onPress = {this.enterNav}>
                    <Image 
                        source = {require('../assets/record.png')}
                        resizeMode = 'contain'
                        style = {{height: '80%'}}
                    />
                </TouchableOpacity>
            </View>
        </View>
      );
    }
  }
/**/
  const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
  });