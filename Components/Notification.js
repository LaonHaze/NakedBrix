import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';

export default class Notification extends React.Component {
    render() {
        return(
            <View style ={styles.container} >
                <Text style = {{color:'white'}}>
                    You are at the right location!
                </Text>
                <Text style = {{color:'white'}}>
                    Start Sampling
                </Text>
                <Button
                    title='Ok'
                    color='white'
                    buttonStyle= {{backgroundColor: 'red'}}
                    onPress = {this.props.closeNotification}
                />
            </View>
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