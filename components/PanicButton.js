import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { StringDictionary, Colors } from '../constants';

export default class PanicButton extends React.Component {

    displayConfirmationAlert() {
        Alert.alert(
            StringDictionary.panic, StringDictionary.panicConfirmation,
            [
                { text: StringDictionary.cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: StringDictionary.ok, onPress: () => {
                        this.props.onPress();
                    }
                },
            ],
            { cancelable: false }
        );
    }

    render() {
        return (
            <Button
                title={StringDictionary.panic}
                onPress={this.displayConfirmationAlert.bind(this)}
                icon={{ name: 'alarm' }}
                titleStyle={styles.titleStyle}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.container} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
        margin: 30
    },
    buttonStyle: {
        backgroundColor: Colors.danger,
        width: 300,
        height: 45,
        borderColor: 'transparent',
        marginTop: 5,
        borderWidth: 0,
        borderRadius: 5
    },
    titleStyle: {
        fontWeight: '700'
    }
});