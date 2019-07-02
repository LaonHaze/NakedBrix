import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native';
import {Input, Button} from 'react-native-elements';

//Simple form component to take sample brix value
export default class TakeSample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            brix: null,
            samplingPoint: null
        }
    }

    componentDidMount() {
        this.setState({samplingPoint: this.props.proximityMarker})
    }

    handleSamplingChange = (samplingPoint) => {
        this.setState({samplingPoint})
    }

    handleBrixChange = (brix) => {
        this.setState({brix})
    }

    render() {
        return(
            <KeyboardAvoidingView style ={styles.container} behavior = 'padding'>
                <View style={{width: '60%'}}>
                    <Input inputStyle={{color:'white'}}
                        labelStyle = {{color:'white'}}
                        inputContainerStyle = {{borderColor: 'white'}}
                        label='Sampling Point'
                        value={this.state.samplingPoint}
                        onChangeText={this.handleSamplingChange}
                    />
                </View>
                <View style={{width: '60%', marginTop: 15}}>
                    <Input inputStyle={{color:'white'}}
                        labelStyle = {{color:'white'}}
                        inputContainerStyle = {{borderColor: 'white'}}
                        label='Brix Value'
                        value={this.state.brix}
                        onChangeText={this.handleBrixChange}
                    />
                </View>
                <View style={{width: '60%', marginTop: 15}}>
                    <Button 
                        title='Submit'
                        color='white'
                        buttonStyle= {{backgroundColor: 'red'}}
                        onPress = {() => {this.props.dataSubmit(this.state)}}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
    }
  });