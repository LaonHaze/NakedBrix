import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Vibration, Image, AsyncStorage } from 'react-native';
import MapScreen from './MapScreen';
import TakeSample from './TakeSample';
import DistanceTracker from './DistanceTracker';
import Notification from './Notification';

export default class MainScreen extends React.Component {
    //there is some consistency issue with state names and prop names not matching... sorry if it gives headaches
    constructor(props) {
      super(props);

      this.state = {
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

    //Component Mount Event, checks assign brix value array, block names array
    async componentDidMount() {
        this.getStorage().then(data => {
            this.setState({brixVals: data});
        });

        let blockNames = Array.from(new Set(this.props.markers.map(a => a.block)));
        
        this.setState({blocks: blockNames});


    }

    //Sets Proximity Marker when user reaches 10m radius of any markers, this is then passed into the TakeSample Component and automatically assigns the sampling point value
    setProximityMarker = (i, name) => {
        let dupe = false;

        if(name == this.state.proximitymarker) {
            dupe = true;
        }

        this.setState({proximitymarker: name},() => {this.openNotification(i, dupe)});
    }

    //Updates Distances array with values calculated
    setDistances = (distances) => {
        this.setState({curDistances: distances});
    }

    //When a sampling point is selected from the distance tracker, sets the selection to that marker
    setMarker = (markerselect) => {
        this.setState({selectedMarker: markerselect.marker});
    }

    //Clears marker selection, currently not bound to any functions i.e. not in use
    setMarkertoNone = () => {
        this.setState({selectedMarker: null});
    }

    //When a sampling block is selected from the distance tracker, sets the selection to that block
    setBlock = (block) => {
        this.setState({selectedBlock: block}, () => {this.setState({distanceView: 'point'})});
    }

    //Clears block selection
    unsetBlock = () => {
        this.setState({distanceView: 'block'}, () => {this.setState({selectedBlock: null})});
    }

    //stores brix value submitted from TakeSample component. Also stores to asyncstorage for persistence
    dataSubmit = (enterVal) => {
        
        let newBrixVals = this.state.brixVals;
        let markerNames = this.props.markers.map(a => a.title);
        let valIndex = markerNames.indexOf(enterVal.samplingPoint);

        if(valIndex != -1) {
            if(newBrixVals[valIndex] === null && enterVal.brix != null) {
                let newCount = this.state.blockCounts;
                newCount += 1;
                this.setState({blockCounts: newCount})
            }

            newBrixVals[valIndex] = enterVal.brix;
            this.setState({brixVals: newBrixVals}, async () => {
                this.setStorage();
            })
            this.setState({menuoption: 'map'});
            //console.log(this.state.brixVals);
        } else {
            console.log('Invalid Sampling Point Name')
        }        
    }

    //Method to retrieve the persisted brix data
    getStorage = async () => {
        try {
            let item = await AsyncStorage.getItem(this.props.code);
            //You'd want to error check for failed JSON parsing...
            if (item != null) {
                return JSON.parse(item).brixVals;
            } else {
                return this.props.markers.map(a => a.brix);
            }       
        } catch (error) {
            console.log(error)
        }
    }

    //Method to set the brix value persistence
    setStorage = async () => {
        await AsyncStorage.setItem(this.props.code, JSON.stringify(this.state))
    }

    //Navigation for main navigation on bottom of screen. Settings window has not been implemented yet
    navigation = (nav) => {
        switch(nav) {
            case "map":
                this.setState({menuoption: 'map'});
                break;
            case "record":
                this.setState({menuoption: 'record'});
                break;
            default:
                this.setState({menuoption: 'map'});
        }
    }

    //Opens notification window when sampling point reached
    openNotification = (i, dupe) => {
        if(this.state.brixVals[i] == null && !dupe) {
            this.setState({notification: true});
        }
    }

    //Closes notification window
    closeNotification = () => {
        this.setState({notification: false});
    }

    //Checks how many sampling points are in a block
    blockNumbers = (block) => {
        let blockNum = 0;

        for(i = 0 ; i < this.props.markers.length; i++) {
            if(this.props.markers[i].block == block) {
                blockNum += 1;
            }
        }

        return blockNum;
    }

    //Checks how many sampling points in a block has been checked
    blockBrixCheck = (block) => {
        let checkedNum = 0;

        for(i = 0; i < this.props.markers.length; i++) {
            if(this.props.markers[i].block == block && this.state.brixVals[i] != null) {
                checkedNum += 1;
            }
        }

        return checkedNum;
    }
  
    render() {
      return (
        <View style = {styles.maincontainer}>
            <View style = {{flex: 1, backgroundColor:'black', alignItems:'center'}}>
                {
                    this.state.selectedBlock == null ?
                    <Text style = {{marginTop: 30, color:'white'}}>
                        All Blocks {this.state.blockCounts}/{this.props.markers.length}
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
                            markerLocations = {this.props.markers} 
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
                            markers = {this.props.markers} 
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
                <TouchableOpacity style ={styles.menuButtons} onPress = {() => {this.navigation("map")}}>
                    <Image 
                        source = {require('../assets/viewmap.png')}
                        resizeMode = 'contain'
                        style = {{height: '80%'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style ={styles.menuButtons} onPress = {() => {this.navigation("record")}}>
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

/*Styles*/
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