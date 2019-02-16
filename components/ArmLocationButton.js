import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { Colors, StringDictionary } from '../constants/';

export default class ArmLocationButton extends React.Component {

    static propTypes = {
        onAccept: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired
    };

    componentWillMount() {
        let title = this.props.location && this.props.location.armed === true ? 'Disarm' : 'Arm';
        this.setState({ title });
    }

    state = {
        title: ''
    };

    _displayConfirmationAlert() {
        Alert.alert(
            this.state.title, `Are you sure you want to ${this.state.title.toLocaleLowerCase()} this location?`,
            [
                { text: StringDictionary.cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: StringDictionary.ok, onPress: () => {

                        let location = this.props.location;

                        location.armed = !location.armed;

                        this.props.onAccept(location);
                    }
                },
            ],
            { cancelable: false }
        );
    }

    render() {
        return (
            <Button
                title={`${this.state.title} Location`.toLocaleUpperCase()}
                disabled={this.props.disabled ? this.props.disabled : false}
                icon={{ name: 'lock' }}
                onPress={this._displayConfirmationAlert.bind(this)}
                loading={this.props.loading ? this.props.loading : false}
                titleStyle={styles.titleStyle}
                buttonStyle={[styles.buttonStyle, { backgroundColor: this.props.location.armed === true ? Colors.success : Colors.danger }]}
                containerStyle={styles.container}
            />
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