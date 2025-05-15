import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SupportMain from '../screens/SupportMain/SupportMain'
import HelpMain from '../screens/HelpMain/HelpMain'
import HelpAnswer from '../screens/HelpAnswer/HelpAnswer'
import AboutUs from '../screens/AboutUs/AboutUs'
import RaiseComplaint from '../screens/RaiseComplaint/RaiseComplaint'
import Feedback from '../screens/Feedback/Feedback'
import { BackHandler } from 'react-native'
import SubmitReading from '../screens/SubmitReading/SubmitReading'
import RequestNewConnection from '../screens/RequestNewConnection/RequestNewConnection'
import DisconnectionRequest from '../screens/DisconnectionRequest/DisconnectionRequest'

const Stack = createStackNavigator()
const SupportNavigationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SupportMain"
        component={SupportMain}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
      <Stack.Screen
        name="HelpMain"
        component={HelpMain}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
      <Stack.Screen
        name="HelpAnswer"
        component={HelpAnswer}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
      <Stack.Screen
        name="raiseComplaint"
        component={RaiseComplaint}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
      <Stack.Screen
        name="feedback"
        component={Feedback}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
      <Stack.Screen
        name="submitReading"
        component={SubmitReading}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
            <Stack.Screen
        name="reqNewConn"
        component={RequestNewConnection}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
      <Stack.Screen
        name="disconnection"
        component={DisconnectionRequest}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //       return true;
        //     });
        //   },
        // })}
      />
    </Stack.Navigator>
  )
}

export default SupportNavigationStack;