import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Alert, ScrollView, RefreshControl } from 'react-native';
import { Icon } from 'expo';
import { Colors, StringDictionary, DefaultStyles } from '../constants';
import { UserAccountRepository } from '../dataaccesslayer';
import { StorageHelper, Lib } from '../utilities';
import { PrimaryButton } from '../components';

export default class SettingsScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;

        onPress = () => {
            params.getServerStatus();
        };

        return {
            title: StringDictionary.settings,
            headerStyle: ApplicationDefaultSettings.headerStyle,
            headerTintColor: ApplicationDefaultSettings.headerTintColor,
            headerTitleStyle: ApplicationDefaultSettings.headerTitleStyle,
            headerRight: (
                <View style={{ marginBottom: -3, marginRight: 10 }}>
                    <TouchableOpacity onPress={this.onPress}>
                        <Icon.Ionicons
                            name={'md-refresh'}
                            size={26}
                            color={Colors.headerTintColor}
                        />
                    </TouchableOpacity>
                </View>
            )
        };
    };

    state = {
        loading: false,
        serverAddress: '',
        user: {},
        serverStatus: '',
    };

    _startLoading = () => {
        this.setState({ loading: true });
    }

    _endLoading = () => {
        this.setState({ loading: false });
    }

    async componentWillMount() {
        this.props.navigation.setParams({
            getServerStatus: this._getServerStatus.bind(this)
        });

        let serverAddress = await StorageHelper.getServerAddress();

        let user = await StorageHelper.getUser();

        await this._getServerStatus();

        this.setState({ serverAddress, user });
    }

    _getServerStatus = async () => {
        try {

            this.setState({ serverStatus: '...', loading: true });

            let serverStatus = await Lib.getServerStatus();

            this.setState({ serverStatus, loading: false });
        } catch (error) {
            this.setState({ serverStatus: error });
        }
    }

    _logOutAsync = async () => {
        try {

            await UserAccountRepository.unRegisterPushNotifications();
            await StorageHelper.clear();

            this.props.navigation.navigate('Auth');
        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _prompToLogout = async () => {
        let validToken = await StorageHelper.validTokenExists();
        if (validToken == true) {
            Alert.alert(
                StringDictionary.logout,
                StringDictionary.logoutConfirmation,
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: this._logOutAsync },
                ],
                { cancelable: false }
            );
        }
        else {
            Vibration.vibrate(1000);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.box, styles.body]}>
                    <ScrollView refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={this._getServerStatus.bind(this)}
                        />
                    }>
                        <View style={styles.card}>

                            <View style={styles.borderdSection}>
                                <Text style={[DefaultStyles.scrollViewHeaderText, { marginBottom: 5 }]}>Server Address:</Text>
                                <Text>{this.state.serverAddress}</Text>
                            </View>

                            <View style={styles.borderdSection}>
                                <Text style={[DefaultStyles.scrollViewHeaderText, { marginBottom: 5 }]}>User:</Text>
                                <Text>{this.state.user.fullName}</Text>
                                <Text>{this.state.user.email}</Text>
                            </View>

                            <View style={styles.borderdSection}>
                                <Text style={[DefaultStyles.scrollViewHeaderText, { marginBottom: 5 }]}>Server Status:</Text>
                                <Text>{this.state.serverStatus}</Text>
                            </View>

                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.box, styles.footer, { alignItems: 'center' }]}>
                    <PrimaryButton
                        title={StringDictionary.logout}
                        icon={'person'}
                        onPress={this._prompToLogout} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: Colors.bodyBackgroundColor,
        flexDirection: 'column'
    },
    card: {
        backgroundColor: Colors.scrollViewBackgroundColor,
        margin: 5,
        padding: 10
    },
    borderdSection: {
        borderBottomWidth: 1,
        paddingBottom: 5,
        paddingTop: 5,
    },
    box: {
        flex: 1
    },
    body: {
        flex: 10
    },
    footer: {
        flex: 1.5,
        marginTop: 'auto'
    },
});