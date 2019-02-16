import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Clipboard } from 'react-native';
import { Icon } from 'expo';
import Modal from "react-native-modal";
import { CheckBox } from 'react-native-elements';
import Validator from 'validator';
import { Col, Grid } from "react-native-easy-grid";
import { Tab, Tabs, TabHeading } from 'native-base';
import { Colors, StringDictionary, ApplicationDefaultSettings, DefaultStyles } from '../constants';
import { PrimaryButton, PrimaryFormInput, DeleteButton } from '../components';
import { Button as NativeBaseButton, Icon as NativeBaseIcon } from 'native-base';
import { LocationActionEventsRepository, ModuleRepository, LocationUsersRepository, ModuleEventsRepository } from '../dataaccesslayer';
import { Lib } from '../utilities';

export default class ManageLocationScreen extends Component {

    static navigationOptions = ({ navigation }) => {

        const { params = {} } = navigation.state;

        _refresh = () => {
            params.handleRefresh();
        };

        return {
            title: StringDictionary.manage,
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
                        </TouchableOpacity>
                    </Col>
                </Grid>
            )
        };
    };

    state = {
        loading: false,
        modules: [],
        showAddUserModal: false,
        userEmail: '',
        moduleEvents: [],
        locationUsers: [],
        locationEvents: [],
        showAddNewModuleModal: false,
        isMotionDetector: false,
        showModuleDetailsModal: false,
        selectedModule: {},
        newModuleName: '',
        location: {}
    };

    async componentWillMount() {
        this.props.navigation.setParams({
            handleRefresh: this._getScreenData.bind(this)
        });

        const { navigation } = this.props;
        const location = navigation.getParam('location', {});

        this.setState({ location });

        await this._getScreenData(location);
    }

    _startLoading = () => {
        this.setState({ loading: true });
    }

    _endLoading = () => {
        this.setState({ loading: false });
    }

    _getScreenData = async (location) => {
        try {

            location = location == null ? this.state.location : location;

            this.setState({ modules: [], loading: true });

            const modules = await ModuleRepository.getModulesByLocation(location);

            const moduleEvents = await ModuleEventsRepository.getModuleEventsByLocation(location);

            const locationUsers = await LocationUsersRepository.getLocationUsers(location);

            const locationEvents = await LocationActionEventsRepository.getLocationEventHistory(location);

            this.setState({
                modules,
                moduleEvents,
                locationUsers,
                locationEvents,
                loading: false,
                selectedModule: {},
                showModuleDetailsModal: false,
                showAddUserModal: false,
                showAddNewModuleModal: false,
                newModuleName: ''
            });

        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _addNewLocationUserAsync = async () => {
        try {
            let locationUser = {
                email: this.state.userEmail,
                locationId: this.state.location.id
            };

            await LocationUsersRepository.createNewLocationUser(locationUser);

            await this._getScreenData();

        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _deleteLocationUserAsync = async (locationUser) => {
        try {
            await LocationUsersRepository.deleteLocationUser(locationUser);

            await this._getScreenData();

        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _addNewModuleAsync = async () => {
        try {
            let module = {
                locationId: this.state.location.id,
                name: this.state.newModuleName,
                isMotionDetector: this.state.isMotionDetector
            };

            await ModuleRepository.createNewModule(module);

            await this._getScreenData();

        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _deleteModuleAsync = async (module) => {
        try {
            await ModuleRepository.deleteModule(module);

            await this._getScreenData();

        } catch (error) {
            this._endLoading();
            Lib.showError(error);
        }
    }

    _selectModule = (module) => {
        this.setState({ showModuleDetailsModal: true, selectedModule: module });
    }

    _writeSelectedModuleIdToClipboard = async () => {
        await Clipboard.setString(this.state.selectedModule.id);
        alert('Copied module id to clipboard');
    };

    render() {

        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Tabs>
                    <Tab heading={
                        <TabHeading>
                            <Text>{StringDictionary.modules}</Text>
                        </TabHeading>}>
                        <View style={[styles.tab]}>
                            <ScrollView refreshControl={
                                <RefreshControl
                                    refreshing={this.state.loading}
                                    onRefresh={this._getScreenData.bind(this)}
                                />
                            }>
                                {this.state.modules.map((module) => (
                                    <TouchableOpacity key={module.id} onPress={() => { this._selectModule(module) }}>
                                        <View style={[styles.scrollViewCard]}>
                                            <View style={{ padding: 5 }}>
                                                <Text style={[DefaultStyles.scrollViewHeaderText]}> {module.name} </Text>
                                            </View>

                                            <View style={{ padding: 5 }}>
                                                <Text> Last Hearbeat: {module.relativeLastHeartbeat} </Text>
                                                <Text> Last Boot: {module.relativeLastBoot} </Text>
                                            </View>

                                            <Grid style={styles.grid}>

                                                <Col style={{ backgroundColor: 'white' }}>
                                                    <Text style={
                                                        {
                                                            fontSize: 15,
                                                            marginLeft: 2,
                                                            fontWeight: '500',
                                                            color: Colors.defaultTextColor
                                                        }}>
                                                        State: {module.stateDisplayed}
                                                    </Text>
                                                </Col>
                                                <Col style={{
                                                    backgroundColor: module.offline == true ? Colors.danger : Colors.success,
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
                            <View style={{ marginTop: 5 }}>
                                <NativeBaseButton dark bordered onPress={() => this.setState({ showAddNewModuleModal: true })}>
                                    <NativeBaseIcon name="add" />
                                </NativeBaseButton>
                            </View>
                        </View>
                    </Tab>
                    <Tab heading={<TabHeading><Text>Events </Text></TabHeading>}>
                        <View style={[styles.tab]}>
                            <ScrollView refreshControl={
                                <RefreshControl
                                    refreshing={this.state.loading}
                                    onRefresh={this._getScreenData.bind(this)}
                                />
                            }>
                                {this.state.moduleEvents.map((moduleEvent) => (
                                    <View key={moduleEvent.id} style={[styles.scrollViewCard]}>
                                        <View style={{ padding: 5 }}>
                                            <Text style={[DefaultStyles.scrollViewHeaderText]}> {moduleEvent.stateDisplayed} </Text>
                                        </View>
                                        <View style={{ padding: 5 }}>
                                            <Text style={{ paddingBottom: 4 }}> Module: {moduleEvent.module.name} </Text>
                                            <Text> {Lib.getFormattedDate(moduleEvent.dateCreated)} </Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </Tab>
                    <Tab heading={<TabHeading><Text>History</Text></TabHeading>}>
                        <View style={[styles.tab]}>
                            <ScrollView refreshControl={
                                <RefreshControl
                                    refreshing={this.state.loading}
                                    onRefresh={this._getScreenData.bind(this)}
                                />
                            }>
                                {this.state.locationEvents.map((locationEvent) => (
                                    <View key={locationEvent.id} style={[styles.scrollViewCard]}>
                                        <View style={{ padding: 5 }}>
                                            <Text style={[
                                                DefaultStyles.scrollViewHeaderText,
                                                {
                                                    color: locationEvent.action === 0 ? Colors.danger : locationEvent.action === 1 ? Colors.black : Colors.success
                                                }]}>
                                                {locationEvent.actionEvent}
                                            </Text>
                                        </View>
                                        <View style={{ padding: 5 }}>
                                            <Text style={{ paddingBottom: 4 }}> Caller: {locationEvent.caller} </Text>
                                            <Text> {Lib.getFormattedDate(locationEvent.dateCreated)} </Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </Tab>

                    <Tab heading={<TabHeading><Text>Users</Text></TabHeading>}>
                        <View style={[styles.tab]}>

                            <ScrollView refreshControl={
                                <RefreshControl
                                    refreshing={this.state.loading}
                                    onRefresh={this._getScreenData.bind(this)}
                                />
                            }>
                                {this.state.locationUsers.map((user) => (
                                    <View key={user.id} style={[styles.scrollViewCard]}>
                                        <Grid style={{ padding: 5 }}>
                                            <Col>
                                                <View style={{ padding: 5 }}>
                                                    <Text style={[DefaultStyles.scrollViewHeaderText]}> {user.email} </Text>
                                                    <Text> {user.name} </Text>
                                                    <Text> Added: {Lib.getFormattedDateNoTime(user.dateCreated)} </Text>
                                                    <Text> {user.isAdmin == true ? "Admin" : ""} </Text>
                                                </View>
                                            </Col>
                                            <Col style={{ width: '25%', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                                                <DeleteButton
                                                    alertTitle={StringDictionary.delete}
                                                    alertDescription={`${StringDictionary.deleteConfirmation}\n${user.email} as a location user?`}
                                                    objectToDelete={user}
                                                    delete={this._deleteLocationUserAsync} />
                                            </Col>
                                        </Grid>
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={{ marginTop: 5 }}>
                                <NativeBaseButton dark bordered onPress={() => this.setState({ showAddUserModal: true })}>
                                    <NativeBaseIcon name="add" />
                                </NativeBaseButton>
                            </View>
                        </View>
                    </Tab>
                </Tabs>

                <Modal isVisible={this.state.showAddUserModal === true} onBackdropPress={() => this.setState({ showAddUserModal: false, userEmail: '' })}>
                    <View style={styles.modalContent} >
                        <View>
                            <Text style={[DefaultStyles.modalHeaderText]} > {StringDictionary.addNewLocationUser}</Text>
                        </View>
                        <View>
                            <PrimaryFormInput
                                label={StringDictionary.userEmail}
                                placeholder={StringDictionary.userEmail}
                                onChangeText={(value) => this.setState({ userEmail: value })} />

                            <PrimaryButton
                                title={StringDictionary.addNewLocationUser}
                                icon={'add'}
                                disabled={!Validator.isEmail(this.state.userEmail)}
                                loading={this.state.loading}
                                onPress={this._addNewLocationUserAsync} />

                            <TouchableOpacity
                                onPress={() => this.setState({ showAddUserModal: false, userEmail: '' })}
                                style={DefaultStyles.textLink}>
                                <Text style={DefaultStyles.textLinkText}>
                                    {StringDictionary.cancel}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.showAddNewModuleModal === true} onBackdropPress={() => this.setState({ showAddNewModuleModal: false, newModuleName: '' })}>
                    <View style={styles.modalContent} >
                        <View>
                            <Text style={[DefaultStyles.modalHeaderText]} > {StringDictionary.addNewModule}</Text>
                        </View>
                        <View>
                            <PrimaryFormInput
                                label={StringDictionary.moduleName}
                                placeholder={StringDictionary.moduleName}
                                onChangeText={(value) => this.setState({ newModuleName: value })} />

                            <CheckBox
                                title={StringDictionary.isMotionDetector}
                                onPress={() => this.setState({ isMotionDetector: !this.state.isMotionDetector })}
                                checked={this.state.isMotionDetector} />

                            <PrimaryButton
                                title={StringDictionary.addNewModule}
                                icon={'add'}
                                loading={this.state.loading}
                                disabled={this.state.newModuleName.length < 1 === true}
                                onPress={this._addNewModuleAsync.bind(this)}
                            />

                            <TouchableOpacity
                                onPress={() => this.setState({ showAddNewModuleModal: false, newModuleName: '' })}
                                style={DefaultStyles.textLink}>
                                <Text style={DefaultStyles.textLinkText}>
                                    {StringDictionary.cancel}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.showModuleDetailsModal === true} onBackdropPress={() => this.setState({ showModuleDetailsModal: false })}>
                    <View style={styles.modalContent} >
                        <View>
                            <Text style={[DefaultStyles.modalHeaderText]}>
                                {this.state.selectedModule.name}
                            </Text>
                        </View>

                        <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            <Text style={{ fontWeight: '700', paddingBottom: 10 }}>
                                Currently: {this.state.selectedModule.offline == true ? 'Offline' : 'Online'}
                            </Text>
                            <Text style={{ paddingBottom: 10 }}>
                                Last Heartbeat: {Lib.getFormattedShortDate(this.state.selectedModule.lastHeartbeat)}
                            </Text>
                            <Text style={{ paddingBottom: 10 }}>
                                Last Boot: {Lib.getFormattedShortDate(this.state.selectedModule.lastBoot)}
                            </Text>

                            <View style={{ marginTop: 5 }}>
                                <NativeBaseButton dark bordered onPress={this._writeSelectedModuleIdToClipboard}>
                                    <NativeBaseIcon name="copy" />
                                </NativeBaseButton>
                            </View>
                        </View>

                        <View>

                            <DeleteButton
                                alertTitle={StringDictionary.delete}
                                alertDescription={`${StringDictionary.deleteConfirmation}\n${this.state.selectedModule.name}`}
                                objectToDelete={this.state.selectedModule}
                                delete={this._deleteModuleAsync} />


                            <TouchableOpacity
                                onPress={() => this.setState({ showModuleDetailsModal: false })}
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
    tab: {
        backgroundColor: Colors.bodyBackgroundColor,
        height: '100%',
        padding: 5
    },
    grid: {
        padding: 5
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

    scrollViewCard: {
        margin: 5,
        backgroundColor: Colors.scrollViewBackgroundColor,
        padding: 5
    },
    socialIcons: {
        flexDirection: 'row',
    }
});
