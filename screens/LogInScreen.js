import React from 'react';
import { View } from 'react-native';
import { StringDictionary, DefaultStyles, Colors } from '../constants';
import { PrimaryButton, PrimaryFormInput } from '../components';
import { Lib, StorageHelper } from '../utilities';
import Validator from 'validator';

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        title: StringDictionary.loginTitle,
        headerStyle: {
            backgroundColor: Colors.headerBackgroundColor,
        },
        headerTintColor: Colors.headerTintColor,
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    state = {
        loading: false,
        email: '',
        password: '',
        serverAddress: '',
        invalidEmail: false,
        invalidServerAddress: false,
        invalidPassword: false,
    };

    render() {
        return (
            <View style={DefaultStyles.container}>
                <View style={DefaultStyles.mainView}>

                    <PrimaryFormInput
                        label={StringDictionary.serverAddress}
                        placeholder={StringDictionary.serverAddress}
                        editable={!this.state.loading}
                        onChangeText={(value) => this.setState({ serverAddress: value })}
                        displayValidationMessage={this.state.invalidServerAddress}
                        validationMessage={StringDictionary.invalidServerAddress} />

                    <PrimaryFormInput
                        label={StringDictionary.email}
                        placeholder={StringDictionary.email}
                        editable={!this.state.loading}
                        onChangeText={(value) => this.setState({ email: value })}
                        displayValidationMessage={this.state.invalidEmail}
                        validationMessage={StringDictionary.invalidEmail} />

                    <PrimaryFormInput
                        label={StringDictionary.password}
                        placeholder={StringDictionary.password}
                        onChangeText={(value) => this.setState({ password: value })}
                        editable={!this.state.loading}
                        displayValidationMessage={this.state.invalidPassword}
                        secureTextEntry={true}
                        validationMessage={StringDictionary.invalidEmail} />

                    <PrimaryButton
                        title={StringDictionary.login}
                        onPress={this._logInAsync}
                        icon={'person'}
                        disabled={this.state.loading}
                        loading={this.state.loading} />

                </View>
            </View>
        );
    }

    _logInAsync = async () => {
        try {

            let serverAddress = this.state.serverAddress;
            serverAddress = Lib.sanitizeServerAddress(serverAddress);
            let validServerAddress = Lib.validateServerAddress(serverAddress);

            if (validServerAddress === false) {
                this.setState({ invalidServerAddress: true });
                alert(StringDictionary.invalidServerAddress);
                return;
            }

            if (!Validator.isEmail(this.state.email)) {
                this.setState({ invalidEmail: true });
                alert(StringDictionary.invalidEmail);
                return;
            }

            let credentials = {
                'email': this.state.email,
                'password': this.state.password
            };

            this.setState({ loading: true });

            await StorageHelper.saveServerAddress(serverAddress);

            let response = await UserAccountRepository.logIn(credentials);

            await StorageHelper.saveToken(response);

            await PushNotificationHelper.registerForPushNotificationsAsync();

            this.props.navigation.navigate('App');

            return;

        } catch (error) {
            this.setState({ loading: false });
            Lib.showError(error);
        }

        this.setState({ loading: false });
    };
}