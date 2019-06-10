import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Vibration} from 'react-native';
import MapScreen from './MapScreen';
import TakeSample from './TakeSample';

EXAMPLE_MARKERS = [
    {
        id: 0,
        title: 'M1',
        coordinates: {
            latitude: -36.843610,
            longitude: 174.750490
        },
        brix: null
    },
    {
        id: 1,
        title: 'M2',
        coordinates: {
            latitude: -36.844410,
            longitude: 174.750490
        },
        brix: null
    },
    {
        id: 2,
        title: 'M3',
        coordinates: {
            latitude: -36.846410,
            longitude: 174.750390
        },
        brix: null
    }
];

export default class MainScreen extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        markers: EXAMPLE_MARKERS,
        distances: null,
        brixVals: null,
        menuoption: 'map',
        proximitymarker: null,
        submissionState: 'waiting',
        blockCounts: 0,
      }
    }

    componentDidMount() {
        let brixValues = EXAMPLE_MARKERS.map(a => a.brix);
        this.setState({brixVals: brixValues});
    }

    setProximityMarker = (name) => {
        this.setState({proximitymarker: name});
        Vibration.vibrate([1000, 2000, 3000] ,500);
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
                <MapScreen setProximityMarker = {this.setProximityMarker} markerLocations = {this.state.markers}/>
                <View style = {{position: 'absolute', height:'100%', width: '100%'}}>
                    {this.state.menuoption == 'record' ? <TakeSample samplingpoint = '2' dataSubmit = {this.dataSubmit} proximityMarker = {this.state.proximitymarker} /> : null}
                </View>
            </View>
            <View style = {{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent:'space-evenly'}}>
                <TouchableOpacity style ={{flex: 1, backgroundColor:'black', alignItems:'center'}}>
                    <Text style = {{marginTop: 30, color:'white'}}>
                        Settings
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style ={{flex: 1, backgroundColor:'black', alignItems:'center'}} onPress = {() => {this.setState({menuoption: 'map'})}}>
                    <Text style = {{marginTop: 30, color:'white'}}>
                        View Map
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style ={{flex: 1, backgroundColor:'black', alignItems:'center'}} onPress = {() => {this.setState({menuoption: 'record'})}}>
                    <Text style = {{marginTop: 30, color:'white'}}>
                        Record Sample
                    </Text>
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