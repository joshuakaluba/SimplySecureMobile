import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TextInput } from 'react-native';
import { FormLabel, FormValidationMessage } from 'react-native-elements';
import { Colors } from '../constants';

class PrimaryFormInput extends React.Component {

    static propTypes = {
        onChangeText: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired
    };

    onFocus() { }

    onBlur() { }

    state = {
        backgroundColor: 'white'
    };

    render() {

        let validationMessage;

        if (this.props.displayValidationMessage == true) {
            validationMessage =
                <FormValidationMessage>
                    {this.props.validationMessage}
                </FormValidationMessage>
        }

        return (
            <View style={styles.container}>
                <FormLabel>
                    {this.props.label}
                </FormLabel>
                <TextInput
                    style={styles.input}
                    editable={this.props.editable}
                    onBlur={this.props.onBlur ? this.props.onBlur : this.onBlur.bind(this)}
                    onFocus={this.props.onFocus ? this.props.onFocus : this.onFocus.bind(this)}
                    placeholder={this.props.placeholder ? this.props.placeholder : ''}
                    onChangeText={this.props.onChangeText}
                    secureTextEntry={this.props.secureTextEntry ? this.props.secureTextEntry : false}
                    autoCapitalize={this.props.autoCapitalize ? this.props.autoCapitalize : 'none'} />
                {
                    validationMessage
                }
            </View>
        );
    }
}

export default PrimaryFormInput;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        marginTop: 5,
        height: 40,
        borderColor: Colors.defaultTextColor,
        padding: 5,
        backgroundColor: '#fff',
        textAlign: 'center',
        borderRadius: 10,
        fontSize: 15,
        width: 300,
        borderWidth: 1
    }
});