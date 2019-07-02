import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView} from 'react-native';
import {Input, Button} from 'react-native-elements';

//Simple form to enter the code at the app start to retrieve marker values
export default class CodeEnter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            code: null
        }
    }

    handleCodeChange = (code) => {
        this.setState({code})
    }

    render () {
        return (
            <KeyboardAvoidingView style ={styles.container} behavior = 'padding'>
                <View style={{width: '60%'}}>
                <Input inputStyle={{color:'white'}}
                        labelStyle = {{color:'white'}}
                        inputContainerStyle = {{borderColor: 'white'}}
                        label='Code'
                        value={this.state.code}
                        onChangeText={this.handleCodeChange}
                    />
                </View>
                <View style={{width: '60%', marginTop: 15}}>
                    <Button 
                        title='Submit'
                        color='white'
                        buttonStyle= {{backgroundColor: 'red'}}
                        onPress = {() => {this.props.submitCode(this.state.code)}}
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