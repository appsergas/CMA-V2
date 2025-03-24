import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import PaymentMain from '../screens/PaymentMain/PaymentMain'
import Statement from '../screens/Statement/Statement'
import RequestNewConnection from '../screens/RequestNewConnection/RequestNewConnection'
import SubmitReading from '../screens/SubmitReading/SubmitReading'
import DisconnectionRequest from '../screens/DisconnectionRequest/DisconnectionRequest'
import { BackHandler } from 'react-native'
import Payment from '../screens/Payment/Payment'

const Stack = createStackNavigator()
const PaymentNavigationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PaymentMain"
        component={PaymentMain}
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
      <Stack.Screen
        name="reqNewConn"
        component={RequestNewConnection}
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
      <Stack.Screen
        name="submitReading"
        component={SubmitReading}
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
      <Stack.Screen
        name="disconnection"
        component={DisconnectionRequest}
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

export default PaymentNavigationStack;