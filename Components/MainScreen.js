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
        selectedBlock: null,
        blocks: null,
        notification: false,
        distanceView: 'block'
      }
    }

    componentDidMount() {
        let brixValues = EXAMPLE_MARKERS.map(a => a.brix);
        let blockNames = Array.from(new Set(EXAMPLE_MARKERS.map(a => a.block)));
        this.setState({brixVals: brixValues});
        this.setState({blocks: blockNames});
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

    setBlock = (block) => {
        this.setState({selectedBlock: block}, () => {this.setState({distanceView: 'point'})});
    }

    unsetBlock = () => {
        this.setState({distanceView: 'block'}, () => {this.setState({selectedBlock: null})});
    }

    dataSubmit = (enterVal) => {
        
        let newBrixVals = this.state.brixVals;
        let markerNames = this.state.markers.map(a => a.title);
        let valIndex = markerNames.indexOf(enterVal.samplingPoint);

        if(valIndex != -1) {
            if(newBrixVals[valIndex] === null && enterVal.brix != null) {
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

    blockNumbers(block) {
        let blockNum = 0;

        for(i = 0 ; i < this.state.markers.length; i++) {
            if(this.state.markers[i].block == block) {
                blockNum += 1;
            }
        }

        return blockNum;
    }

    blockBrixCheck(block) {
        let checkedNum = 0;

        for(i = 0; i < this.state.markers.length; i++) {
            if(this.state.markers[i].block == block && this.state.brixVals[i] != null) {
                checkedNum += 1;
            }
        }

        return checkedNum;
    }
  
    render() {
      return (
        <View style={styles.maincontainer}>
            <StatusBar hidden />
            <View style = {{flex: 1, backgroundColor:'black', alignItems:'center'}}>
                {
                    this.state.selectedBlock == null ?
                    <Text style = {{marginTop: 30, color:'white'}}>
                        All Blocks {this.state.blockCounts}/{this.state.markers.length}
                    </Text>:
                    <Text style = {{marginTop: 30, color:'white'}}>
                        {this.state.selectedBlock} Block {this.blockBrixCheck(this.state.selectedBlock)}/{this.blockNumbers(this.state.selectedBlock)}
                    </Text>
                }
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
                            distances = {this.state.curDistances}
                        />
                        : null}
                <View>
                    {this.state.curDistances != null ? 
                        <DistanceTracker 
                            distances = {this.state.curDistances} 
                            markers = {this.state.markers} 
                            brixVals = {this.state.brixVals} 
                            setMarker = {this.setMarker}
                            blocks = {this.state.blocks}
                            selectedBlock = {this.state.selectedBlock}
                            setBlock = {this.setBlock}
                            unsetBlock = {this.unsetBlock}
                            distanceView = {this.state.distanceView}
                        /> 
                        : null}              
                </View>
                <View style = {styles.notificationWindow}>
                    {this.state.notification ? 
                        <Notification closeNotification = {this.closeNotification} />
                        : null}
                </View>
                <View style = {styles.recordWindow}>
                    {this.state.menuoption == 'record' ? 
                        <TakeSample 
                            samplingpoint = '2' 
                            dataSubmit = {this.dataSubmit} 
                            proximityMarker = {this.state.proximitymarker} 
                        /> 
                        : null}
                </View>
            </View>
            <View style = {styles.menuContainer}>
                <TouchableOpacity style ={styles.menuButtons} >
                    <Image 
                        source = {require('../assets/settings.png')}
                        resizeMode = 'contain'
                        style = {{height: '80%'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style ={styles.menuButtons} onPress = {this.mapNav}>
                    <Image 
                        source = {require('../assets/viewmap.png')}
                        resizeMode = 'contain'
                        style = {{height: '80%'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style ={styles.menuButtons} onPress = {this.enterNav}>
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
    menuButtons: {
        flex: 1, 
        backgroundColor:'black', 
        alignItems:'center'
    },
    menuContainer: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'stretch', 
        justifyContent:'space-evenly'
    },
    recordWindow: {
        position: 'absolute', 
        height:'100%',
        width: '100%'
    },
    notificationWindow: {
        position: 'absolute',
        width:'70%', 
        height:'25%', 
        left:'15%', 
        top:'40%'
    }
});