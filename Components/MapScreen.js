import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
          selectedmarker: null,
          error: null
        };
    }

    componentDidMount() {
        this.setState({markers: this.props.markerLocations});

        navigator.geolocation.getCurrentPosition(
            position => {
            console.log(position);

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

    
    checkDistance = (curr) => {
        let curmarkers = this.state.markers;
        for(let i = 0; i < curmarkers.length; i++) {
            let distance = haversine(curmarkers[i].coordinates, curr);
            if(distance < 0.02){
                this.props.setProximityMarker(curmarkers[i].title);
                break;
            }
        };
    }

    testMarkerMove = (e) => {
        this.setState({x: e.nativeEvent.coordinate});
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
                    onPress = {() => {this.setState({selectedmarker: null})}}
                >
                    {
                        this.state.markers.map((marker) => (
                            <Marker 
                                key={marker.title} 
                                title={marker.title} 
                                coordinate={marker.coordinates} 
                                description={(this.calcDistance(this.state.x,marker.coordinates)*1000).toFixed(2).toString(10) + "m"} 
                                onPress={() => {this.setState({selectedmarker: marker.coordinates})}}
                            />
                        ))
                    }
                    <Marker draggable coordinate={this.state.x} onDragEnd={(e) => this.testMarkerMove(e)} title={'Mock Location'}/>
                    {
                        this.state.selectedmarker == null ? null : <Polyline coordinates={[this.state.x,this.state.selectedmarker]} strokeWidth = {3}/>
                    }
                    {
                        this.state.currentLoc == null ? null : <Marker.Animated ref={marker => {this.marker = marker;}} title={"true location"} coordinate={this.state.currentLoc} description={this.state.currentLoc.longitude.toString() + " " + this.state.currentLoc.latitude.toString()}/>
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
  });