import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, RefreshControl } from 'react-native';
import { Icon } from 'expo';
import Modal from "react-native-modal";
import { CheckBox } from 'react-native-elements';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Colors, StringDictionary, ApplicationDefaultSettings, DefaultStyles } from '../constants';
import { PrimaryButton, PrimaryFormInput, ArmLocationButton, DeleteButton } from '../components';
import { LocationRepository } from '../dataaccesslayer';
import { Lib } from '../utilities';

export default class LocationScreen extends Component {

    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;

        _refresh = () => {
            params.handleRefresh();
        };

        _showAddNewLocationModal = () => {
            params.showAddNewLocationModal();
        };

        return {
            title: StringDictionary.locations,
            headerStyle: ApplicationDefaultSettings.headerStyle,
            headerTintColor: ApplicationDefaultSettings.headerTintColor,
            headerTitleStyle: ApplicationDefaultSettings.headerTitleStyle,
            headerRight: (
                <Grid style={{ marginBottom: -3, marginRight: 10 }}>
                    <Col style={{ marginRight: 15 }}>
                        <TouchableOpacity onPress={this._refresh}>
                            <Icon.Ionicons
                                name={'md-refresh'}
                                size={26}
                                color={Colors.headerTintColor}
                            />
                        </TouchableOpacity></Col>
                    <Col>
                        <TouchableOpacity onPress={this._showAddNewLocationModal}>
                            <Icon.Ionicons
                                name={'md-add'}
                                size={26}
                                color={Colors.headerTintColor}
                            />
                        </TouchableOpacity>
                    </Col>
                </Grid>
            )
        };
    };

    state = {
        loading: false,
        showAddNewLocationModal: false,
        showLocationDetailsModal: false,
        locationName: '',
        isSilentAlarm: false,
        locations: [],
        location: {}
    };

    async componentWillMount() {
        this.props.navigation.setParams({
            handleRefresh: this._getLocations.bind(this),
            showAddNewLocationModal: this._showAddNewLocationModal.bind(this),
        });

        await this._getLocations();
    }

    _startLoading = () => {
        this.setState({ loading: true });
    }

    _endLoading = () => {
        this.setState({ loading: false });
    }
    _showAddNewLocationModal = () => {
        this.setState({ showAddNewLocationModal: true });
    }

    _getLocations = async () => {
        try {
            this.setState({ locations: [], loading: true });

            let locations = await LocationRepository.getLocations();

            this.setState({ locations, loading: false });

        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _selectLocation = (location) => {
        this.setState({ showLocationDetailsModal: true, location });
    }

    _manageModules = () => {
        this.setState({ showLocationDetailsModal: false });

        this.props.navigation.push('Manage', { "location": this.state.location });
    }

    _deleteLocationAsync = async (location) => {
        try {
            this.setState({ loading: true, showLocationDetailsModal: false });
            await LocationRepository.deleteLocation(location);

            await this._getLocations();
        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _updateLocationArmedStateAsync = async (location) => {
        try {
            this.setState({ showLocationDetailsModal: false });

            await LocationRepository.updateLocationArmedState(location);

            await this._getLocations();
        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _addNewLocationAsync = async () => {
        try {
            this.setState({ loading: true, showAddNewLocationModal: false });

            let location = {
                name: this.state.locationName,
                isSilentAlarm: this.state.isSilentAlarm
            };

            await LocationRepository.createNewLocation(location);

            await this._getLocations();

        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    render() {
        return (
            <View style={DefaultStyles.container}>
                <ScrollView style={[styles.container]}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={this._getLocations.bind(this)}
                        />
                    }>
                    {
                        this.state.locations.map((location) => (

                            <TouchableOpacity key={location.id} onPress={() => { this._selectLocation(location) }}>
                                <View style={[styles.card]}>

                                    <View style={styles.listHeader}>
                                        <Text style={[DefaultStyles.scrollViewHeaderText]}>
                                            {location.name}
                                        </Text>
                                    </View>
                                    <Grid style={styles.grid}>

                                        <Col style={{ backgroundColor: 'white', padding: 5 }}>
                                            <Text style={
                                                {
                                                    fontSize: 15,
                                                    color: Colors.defaultTextColor
                                                }}>
                                                State: {location.status}
                                            </Text>
                                        </Col>
                                        <Col style={{
                                            backgroundColor: location.armed == true ? Colors.danger : Colors.success,
                                            width: 25,
                                            height: 25,
                                            borderRadius: 5
                                        }}>
                                        </Col>

                                    </Grid>
                                </View>
                            </TouchableOpacity>
                        ))}
                </ScrollView>

                <Modal isVisible={this.state.showAddNewLocationModal === true} onBackdropPress={() => this.setState({ showAddNewLocationModal: false })}>
                    <View style={styles.modalContent} >
                        <View>
                            <Text style={[DefaultStyles.modalHeaderText]} > {StringDictionary.addNewLocation}</Text>
                        </View>
                        <View>
                            <PrimaryFormInput
                                label={StringDictionary.locationName}
                                placeholder={StringDictionary.locationName}
                                onChangeText={(value) => this.setState({ locationName: value })} />

                            <CheckBox
                                title={StringDictionary.isSilentAlarm}
                                onPress={() => this.setState({ isSilentAlarm: !this.state.isSilentAlarm })}
                                checked={this.state.isSilentAlarm} />

                            <PrimaryButton
                                title={StringDictionary.addNewLocation}
                                icon={'add'}
                                loading={this.state.loading}
                                disabled={this.state.locationName.length < 1 === true}
                                onPress={this._addNewLocationAsync.bind(this)}
                            />

                            <TouchableOpacity
                                onPress={() => this.setState({ showAddNewLocationModal: false })}
                                style={DefaultStyles.textLink}>
                                <Text style={DefaultStyles.textLinkText}>
                                    {StringDictionary.cancel}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.showLocationDetailsModal === true} onBackdropPress={() => this.setState({ showLocationDetailsModal: false })}>
                    <View style={styles.modalContent} >
                        <View>
                            <Text style={[DefaultStyles.modalHeaderText]}>
                                {this.state.location.name}
                            </Text>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text>
                                Currently: {this.state.location.status}
                            </Text>
                        </View>

                        <View>

                            <View style={{ marginTop: 10 }}>
                                <ArmLocationButton
                                    location={this.state.location}
                                    onAccept={this._updateLocationArmedStateAsync} />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <PrimaryButton
                                    title={StringDictionary.manage}
                                    icon={'list'}
                                    loading={this.state.loading}
                                    onPress={this._manageModules.bind(this)} />
                            </View>

                            <DeleteButton
                                alertTitle={StringDictionary.delete}
                                alertDescription={`${StringDictionary.deleteConfirmation}\n${this.state.location.name}`}
                                objectToDelete={this.state.location}
                                delete={this._deleteLocationAsync} />


                            <TouchableOpacity
                                onPress={() => this.setState({ showLocationDetailsModal: false })}
                                style={DefaultStyles.textLink}>
                                <Text style={DefaultStyles.textLinkText}>
                                    {StringDictionary.cancel}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    listHeader: {
        padding: 10,
        flexDirection: 'row',
        width: "100%"
    },
    box: {
        flex: 1
    },
    grid: {
        paddingLeft: 5,
        paddingRight: 5
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    body: {
        flex: 7
    },
    footer: {
        flex: 3,
        marginTop: 'auto'
    },
    card: {
        backgroundColor: Colors.scrollViewBackgroundColor,
        paddingBottom: 10,
        marginBottom: 5,
        alignItems: 'center',
    },
    socialIcons: {
        flexDirection: 'row',
    }
});
