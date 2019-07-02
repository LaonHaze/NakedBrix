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
            minHeight: 40,
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

    viewSwitch(block) {
        this.props.setBlock(block);
    }

    shortestDistance(block) {
        let shortestDistance = null;
        for(i = 0 ; i < this.props.markers.length; i++) {
            if(this.props.markers[i].block == block && shortestDistance == null) {
                shortestDistance = this.props.distances[i];
            }
            else if(this.props.markers[i].block == block && this.props.distances[i] < shortestDistance) {
                shortestDistance = this.props.distances[i];
            }
        }

        if (shortestDistance == null) {
            shortestDistance = "unknown";
        }

        return shortestDistance
    }

    blockBrixCheck(block) {
        let blockDone = true;

        for(i = 0 ; i < this.props.markers.length; i++) {
            if(this.props.markers[i].block == block && this.props.brixVals[i] == null) {
                blockDone = false;
            }
        }

        return blockDone;
    }

    render() {
        return(
            <Animated.View style = {[styles.container,{height: this.state.animation}]}>
                {this.state.expanded?
                    <View style = {{flexDirection:'row'}}>
                        {this.props.distanceView == 'block'?
                            <Text style = {styles.invisibleTitle}>
                                Show Distance to All Locations
                            </Text>
                            :
                            <Button
                                buttonStyle= {styles.distanceButton}
                                title = "View All Blocks"
                                onPress={() => {this.props.unsetBlock()}}
                            />
                        }
                        
                        <Button
                            icon = {<Icon 
                                name='chevron-down' 
                                color='black'
                            />}
                            buttonStyle= {styles.distanceButton}
                            onPress={() => {this.toggle()}}
                        />
                    </View>:
                    <View style = {{flexDirection:'row'}}>
                        <Text style = {styles.visibleTitle}>
                            Show Distance to All Locations
                        </Text>
                        <Button
                            icon = {<Icon 
                                        name='chevron-up' 
                                        color='black'
                                    />}
                            buttonStyle= {styles.distanceButton}
                            onPress={() => {this.toggle()}}
                        />
                    </View>
                }
                <ScrollView>
                {
                    this.props.distanceView == 'block'?
                    this.props.blocks.map((block, index) => (
                        <View key = {index} style = {styles.mainWindow}>
                            <Text style = {{color: 'white', marginBottom: 5}}>Distance To Location: {this.shortestDistance(block)} Meters</Text>
                            {
                                this.blockBrixCheck(block)?
                                <Button
                                    color='white'
                                    buttonStyle= {{backgroundColor: 'lightgreen'}}
                                    title = {block + " Block"}
                                    onPress = {() => {this.viewSwitch(block)}}
                                />
                                :
                                <Button
                                    color='white'
                                    buttonStyle= {{backgroundColor: 'red'}}
                                    title = {block + " Block"}
                                    onPress = {() => {this.viewSwitch(block)}}
                                />
                            }
                            
                        </View>
                    ))
                    :
                    this.props.markers.map((marker, index) => (
                        <View key = {index + 1000}>
                            {
                                marker.block == this.props.selectedBlock?
                                    <View key = {index} style = {styles.mainWindow}>
                                    <Text key = {marker.id} style = {{color: 'white', marginBottom: 5}}>Distance To Location: {this.props.distances[index]} Meters</Text>
                                    
                                    {this.props.brixVals[index] == null ? 
                                        <Button 
                                            key = {marker.title}
                                            color='white'
                                            buttonStyle= {{backgroundColor: 'red'}}
                                            title = {"Sampling Location "  + marker.title}
                                            onPress = {() => {this.props.setMarker({marker})}}
                                        /> : 
                                        <Button 
                                            key = {marker.title} 
                                            color='white'
                                            buttonStyle= {{backgroundColor: 'lightgreen'}}
                                            title = {"Sampling Location "  + marker.title} 
                                            onPress = {() => {this.props.setMarker({marker})}}
                                        />}
                                    </View>
                                :
                                null
                            }
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
    },
    distanceButton: {
        backgroundColor: 'red', 
        minWidth: '25%', 
        marginTop: 5, 
        marginBottom: 5
    },
    visibleTitle:{
        color: 'white', 
        paddingTop: 10, 
        marginRight: 5
    },
    invisibleTitle:{
        color: 'black', 
        paddingTop: 10, 
        marginRight: 5
    },
    mainWindow: {
        marginTop: 15,
        marginBottom: 5
    }
  });