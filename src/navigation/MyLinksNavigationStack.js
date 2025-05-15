import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import PaymentMain from '../screens/PaymentMain/PaymentMain'
import MyLinksMain from '../screens/MyLinksMain/MyLinksMain'
import ProfileView from '../screens/ProfileView/ProfileView'
import ProfileEdit from '../screens/ProfileEdit/ProfileEdit'
import DisconnectionRequest from '../screens/DisconnectionRequest/DisconnectionRequest'
import RequestNewConnection from '../screens/RequestNewConnection/RequestNewConnection'
import MyRequests from '../screens/MyRequests/MyRequests'
import Statement from '../screens/Statement/Statement'
import { BackHandler } from 'react-native'
import HelpAndSupport from '../screens/HelpAndSupport/HelpAndSupport'
import Feedback from '../screens/Feedback/Feedback'
import RaiseComplaint from '../screens/RaiseComplaint/RaiseComplaint'
import HelpAnswer from '../screens/HelpAnswer/HelpAnswer'
import HelpMain from '../screens/HelpMain/HelpMain'

import OcrTest from '../screens/OcrTest/OcrTest'


const Stack = createStackNavigator()
const MyLinksNavigationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen
        name="MyLinks"
        component={MyLinksMain}
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
        name="myAccounts"
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
      // listeners={({navigation,route})=>({
      //   blur:()=>{
      //     navigation.dispatch(
      //       CommonActions.reset({
      //         index:4,
      //         routes:[{name:''}]
      //       })
      //     )
      //   },
      // })}
      />
      <Stack.Screen
        name="profileEdit"
        component={ProfileEdit}
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
        name="disconnectionRequest"
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
        name="connectionRequest"
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
        name="myRequests"
        component={MyRequests}
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
        //       return true;
        //     });
        //   },
        // })}
      />
      <Stack.Screen
        name="helpAndSupport"
        component={HelpAndSupport}
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
        name="OcrTest"
        component={OcrTest}
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

export default MyLinksNavigationStack;