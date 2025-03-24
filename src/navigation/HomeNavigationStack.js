import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Register from '../screens/Register/Register'
import HomeMain from '../screens/HomeMain/HomeMain'
import RequestNewConnection from '../screens/RequestNewConnection/RequestNewConnection'
import SubmitReading from '../screens/SubmitReading/SubmitReading'
import OcrTest from '../screens/OcrTest/OcrTest'
import ProfileView from '../screens/ProfileView/ProfileView'
import { Alert, BackHandler } from 'react-native'
import Payment from '../screens/Payment/Payment'
import HelpMain from '../screens/HelpMain/HelpMain'
import HelpAnswer from '../screens/HelpAnswer/HelpAnswer'
import RaiseComplaint from '../screens/RaiseComplaint/RaiseComplaint'
import Feedback from '../screens/Feedback/Feedback'
import Statement from '../screens/Statement/Statement'
import DisconnectionRequest from '../screens/DisconnectionRequest/DisconnectionRequest'

const Stack = createStackNavigator()
const HomeNavigationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeMain}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="reqNewConn"
        component={RequestNewConnection}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       // return true
        //       Alert.alert(
        //           'Exit App',
        //           'Exiting the application?', [{
        //               text: 'Cancel',
        //               onPress: () => {
        
        //               },
        //               style: 'cancel'
        //           }, {
        //               text: 'OK',
        //               onPress: () => BackHandler.exitApp()
        //           },], {
        //           cancelable: false
        //       }
        //       )
        //       return true;
        //   });
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
        name="testOcr"
        component={OcrTest}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="profile"
        component={ProfileView}
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
        name="Payment"
        component={Payment}
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
        name="statement"
        component={Statement}
        options={{ title: '' }}
        // listeners={({ navigation, route }) => ({
        //   focus: (e) => {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //       navigation.goBack()
        //        return true;
        //      } );
        //   },
        // })}
      />
    </Stack.Navigator>
  )
}

export default HomeNavigationStack;