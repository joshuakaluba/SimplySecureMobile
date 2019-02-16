import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { TabBarIcon } from '../components';
import { ApplicationDefaultSettings, StringDictionary } from '../constants';
import { LocationScreen, SettingsScreen, ManageLocationScreen } from '../screens';

const LocationScreenStack = createStackNavigator({
  Locations: LocationScreen,
  Manage: ManageLocationScreen
});

LocationScreenStack.navigationOptions = {
  tabBarLabel: StringDictionary.locations,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-list-box' : 'md-list-box'}
    />
  )
};

const SettingsScreenStack = createStackNavigator({
  Settings: SettingsScreen
});

SettingsScreenStack.navigationOptions = {
  tabBarLabel: StringDictionary.settings,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-cog' : 'md-cog'}
    />
  )
};

const MainTabNavigator = createBottomTabNavigator({
  LocationScreenStack, SettingsScreenStack
}, {
    tabBarOptions: ApplicationDefaultSettings.tabBarOptions
  });

export default MainTabNavigator