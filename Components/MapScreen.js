import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE, AnimatedRegion, ProviderPropType } from 'react-native-maps';
import haversine from 'haversine';

const LATITUDE = -36.853610;
const LONGITUDE = 174.764900;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default class MapScreen extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          region: {
            latitude: -36.843610,
            latitudeDelta: 0.01,
            longitude: 174.754490,
            longitudeDelta: 0.01
          },
          currentLoc: new AnimatedRegion(null),
          x: {
            latitude: -36.843610,
            longitude: 174.754490
          },
          markers: []
          ,
          error: null,
          testView: true
        };
    }

    componentDidMount() {
        this.setState({markers: this.props.markerLocations}, () => {this.updateDistance(this.state.x)});

        navigator.geolocation.getCurrentPosition(
            position => {

            this.setState({
                region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                },
                currentLoc: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                },
                error: null
            });
            },
            error => this.setState({
            error: error.message
            }),
            {
                enableHighAccuracy: true,
                timeout: 20000, 
                maximumAge: 1000
            }
        );
        this.watchID = navigator.geolocation.watchPosition(
            position => 
            {
                const curLocation = position.coords;
                this.setState({currentLoc: curLocation});
            }, 
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 10,
                distanceFilter: 1
            }
        );    
    }

    animate() {
        const { coordinate } = this.state;
        const newCoordinate = {
          latitude: LATITUDE + (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
          longitude: LONGITUDE + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2),
        };
    
        if (Platform.OS === 'android') {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }
    }

    /*
    componentWillReceiveProps(nextProps) {
        const duration = 500
        
        if (this.props.coordinate !== nextProps.coordinate) {
            if (Platform.OS === 'android') {
            if (this.marker) {
                this.marker._component.animateMarkerToCoordinate(
                nextProps.coordinate,
                duration
                );
            }
            } else {
            this.state.coordinate.timing({
                ...nextProps.coordinate,
                duration
            }).start();
            }
        }
    }
    */

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    calcDistance = (prev, curr) => {
        return haversine(prev, curr) || 0;
    }

    updateDistance = (curr) => {
        let curmarkers = this.state.markers;
        let distances = curmarkers.map(m => (haversine(m.coordinates, curr)*1000).toFixed(2));
        this.props.setDistances(distances);
    }
    
    checkDistance = (curr) => {
        let curmarkers = this.state.markers;
        for(let i = 0; i < curmarkers.length; i++) {
            let distance = haversine(curmarkers[i].coordinates, curr);
            if(distance < 0.01){
                this.props.setProximityMarker(i, curmarkers[i].title);
                break;
            }
        };
    }

    testMarkerMove = (e) => {
        this.setState({x: e.nativeEvent.coordinate});
        this.updateDistance(e.nativeEvent.coordinate);
        this.checkDistance(e.nativeEvent.coordinate);
    }

    render() {
        return(
            <View style ={styles.container}>
                <MapView
                    initialRegion = {this.state.region}
                    provider = {PROVIDER_GOOGLE}
                    mapType = {'satellite'}
                    style = {{ ...StyleSheet.absoluteFillObject}}
                    showsUserLocation = {!this.state.testView}
                    onUserLocationChange = {(e) => {!this.state.testView? this.testMarkerMove(e) : null}}
                    toolbarEnabled = {false}
                >
                    {
                        this.props.markerLocations.map((marker, index) => (
                                <Marker 
                                    key={marker.title}
                                    coordinate={marker.coordinates}
                                >
                                    {this.props.brixVals[index] == null ?
                                        <View style = {{left: 2, top: 8}}>
                                            {
                                                this.props.selectedM == null ? 
                                                    null : 
                                                    (this.props.selectedM.title == marker.title ? 
                                                        <Text style ={styles.distanceText}>{this.props.distances[index]}m</Text> 
                                                        : null)
                                            }
                                            <Image source = {require('../assets/baseMarker.png')} style = {{height: 70}} resizeMode = 'contain'/>
                                            <Text style={styles.markerText}>{marker.title}</Text>   
                                        </View>
                                        :
                                        <View style = {{height: 70, width: 70, left: 8}}>
                                            {
                                                this.props.selectedM == null ? 
                                                    null : 
                                                    (this.props.selectedM.title == marker.title ? 
                                                        <Text numberOfLines={1} style ={{color:'white', backgroundColor: 'black', position: 'absolute', overflow: 'visible'}}>{this.props.distances[index]}m</Text> 
                                                        : null)
                                            }
                                            <Image source = {require('../assets/tickMarker.png')} style = {{height: 48, bottom: -22}} resizeMode = 'contain'/>
                                        </View>
                                    }
                                </Marker>
                        ))
                    }
                    {
                        this.state.testView ? <Marker draggable coordinate={this.state.x} onDragEnd={(e) => this.testMarkerMove(e)} title={'Mock Location'} pinColor='blue'/> : null
                    }
                    
                    {
                        this.props.selectedM == null ? null : <Polyline coordinates={[this.state.x,this.props.selectedM.coordinates]} strokeWidth = {3}/>
                    }
                </MapView>
            </View>
        );
    }
}

MapScreen.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    distanceText: {
        color:'white', 
        backgroundColor: 'black', 
        position:'absolute', 
        top:-5, 
        left: 34
    },
    markerText: {
        color: 'white', 
        backgroundColor: 'black', 
        position:'absolute', 
        paddingLeft:6,
        paddingTop:5.5, 
        height: 24, 
        width: 24, 
        borderRadius: 12, 
        fontSize: 8, 
        top:18, 
        left: 46.5
    }
  });

//description={(this.calcDistance(this.state.x,marker.coordinates)*1000).toFixed(2).toString(10) + "m"}

/*
                    {
                        this.state.currentLoc == null ? null : <Marker.Animated ref={marker => {this.marker = marker;}} title={"true location"} coordinate={this.state.currentLoc} description={this.state.currentLoc.longitude.toString() + " " + this.state.currentLoc.latitude.toString()}/>
                    }
*/