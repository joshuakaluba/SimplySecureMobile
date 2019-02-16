import React from 'react';
import { Alert, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button as NativeBaseButton, Icon as NativeBaseIcon } from 'native-base';
import { StringDictionary } from '../constants';

export default class DeleteButton extends React.Component {

    static propTypes = {
        alertTitle: PropTypes.string.isRequired,
        alertDescription: PropTypes.string.isRequired,
        objectToDelete: PropTypes.object.isRequired
    };

    componentWillMount() {
        this.setState({
            objectToDelete: this.props.objectToDelete
        });
    }

    state = {
        objectToDelete: {}
    };

    displayConfirmationAlert() {
        Alert.alert(
            this.props.alertTitle, this.props.alertDescription,
            [
                { text: StringDictionary.cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: StringDictionary.ok, onPress: () => {
                        this.props.delete(this.props.objectToDelete);
                    }
                },
            ],
            { cancelable: false }
        );
    }

    render() {
        return (

            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                alignContent: 'center',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}>
                <NativeBaseButton danger bordered onPress={this.displayConfirmationAlert.bind(this)}>
                    <NativeBaseIcon name="trash" />
                </NativeBaseButton>
            </View>
        );
    }
}