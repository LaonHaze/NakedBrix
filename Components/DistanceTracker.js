import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class DistanceTracker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            animation: new Animated.Value(),
            maxHeight: 300,
            minHeight: 45
        }
    }

    toggle() {
         //Step 1
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
        finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;
        this.setState({
            expanded : !this.state.expanded  //Step 2
        }, () => {
            this.state.animation.setValue(initialValue);  //Step 3
            Animated.spring(     //Step 4
                this.state.animation,
                {
                    toValue: finalValue
                }
            ).start();  //Step 5
        });        
    }
    
    componentDidMount() {
        this.state.animation.setValue(this.state.minHeight);
    }

    render() {
        return(
            <Animated.View style = {[styles.container,{height: this.state.animation}]}>
                {this.state.expanded?
                    <View style = {{flexDirection:'row'}}>
                        <Text style = {{color: 'black'}}>
                            Show Distance to All Locations
                        </Text>
                        <Button
                            icon = {<Icon 
                                name='chevron-down' 
                                color='black'
                            />}
                            buttonStyle= {{backgroundColor: 'red', minWidth: '25%', marginTop: 5, marginBottom: 5}}
                            onPress={() => {this.toggle()}}
                        />
                    </View>:
                    <View style = {{flexDirection:'row'}}>
                        <Text style = {{color: 'white', paddingTop: 10, marginRight: 5}}>
                            Show Distance to All Locations
                        </Text>
                        <Button
                            icon = {<Icon 
                                        name='chevron-up' 
                                        color='black'
                                    />}
                            buttonStyle= {{backgroundColor: 'red', minWidth: '25%', marginTop: 5, marginBottom: 5}}
                            onPress={() => {this.toggle()}}
                        />
                    </View>
                }
                <ScrollView>
                {
                    this.props.markers.map((marker, index) => (
                        <View key = {index} style = {{marginTop: 15,marginBottom: 5}}>
                            <Text key = {marker.id} style = {{color: 'white', marginBottom: 5}}>Distance To Location: {this.props.distances[index]} Meters</Text>
                            
                            {this.props.brixVals[index] == null ? 
                                <Button 
                                    key = {marker.title} 
                                    color='white'
                                    buttonStyle= {{backgroundColor: 'red'}}
                                    title = {marker.title}
                                    onPress = {() => {this.props.setMarker({marker})}}
                                /> : 
                                <Button 
                                    key = {marker.title} 
                                    color='white'
                                    buttonStyle= {{backgroundColor: 'lightgreen'}}
                                    title = {marker.title} 
                                    onPress = {() => {this.props.setMarker({marker})}}
                                />}
                        </View>
                    ))
                }
                </ScrollView>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      color:'white',
      overflow: 'hidden'
    }
  });