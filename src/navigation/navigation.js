import React, { useEffect } from 'react'
import SplashScreen from '../screens/SplashScreen/SplashScreen'
import Login from '../screens/Login/Login'
import { CommonActions, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OtpScreen from '../screens/OtpScreen/OtpScreen'
import EmailLogin from '../screens/EmailLogin/EmailLogin'
import Register from '../screens/Register/Register'
import HomeIcon from '../../assets/icons/HomeIcon'
import PaymentIcon from '../../assets/icons/PaymentIcon'
import SupportIcon from '../../assets/icons/SupportIcon'
import MyLinksIcon from '../../assets/icons/MyLinksIcon'
import HomeNavigationStack from './HomeNavigationStack'
import PaymentNavigationStack from './PaymentNavigationStack'
import SupportNavigationStack from './SupportNavigationStack'
import MyLinksNavigationStack from './MyLinksNavigationStack'
import { Alert, BackHandler, Platform, View, Text,  } from 'react-native'
import { useRoute } from '@react-navigation/native';
import OcrTest from '../screens/OcrTest/OcrTest'
import ECPLOption from '../screens/ECPLOption/ECPLOption'
import ECPLinking from '../screens/ECPLinking/ECPLinking'
import Walkthrough from '../screens/WalkThrough/Walkthrough'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {

  const route = useRoute();

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backAction);

  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  // }, []);


  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontFamily: "Tajawal-Medium", fontSize: 14 },
        tabBarIconStyle: { marginTop: 10 },
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarActiveTintColor: "#FEBA12",
        tabBarStyle: {
          backgroundColor: "#102D4F",
          paddingBottom: 5,
          // height: 64,
          height: 84,
          position: "absolute",
          left: 0,
          right: 0,
          paddingBottom: Platform.OS === "ios" ? 15 : 0,
          // bottom: Platform.OS === "ios" ? 15 : 0,
          borderColor: "rgba(0, 0, 0, 1)",
        },
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigationStack}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color, fontSize: 14, fontFamily: "Tajawal-Medium" }}>Home</Text>
              {focused && <View style={dotStyle} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={SupportNavigationStack}
        options={{
          tabBarIcon: ({ focused, color }) => <SupportIcon fill={focused ? color : "none"} color={color}/>,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color, fontSize: 14, fontFamily: "Tajawal-Medium" }}>Services</Text>
              {focused && <View style={dotStyle} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Payment"
        component={PaymentNavigationStack}
        options={{
          tabBarIcon: ({ focused, color }) => <PaymentIcon color={focused ? "#102D4F" : "#E6E6E6"} fill={focused ? color : "none"} />,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color, fontSize: 14, fontFamily: "Tajawal-Medium" }}>Payment</Text>
              {focused && <View style={dotStyle} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={MyLinksNavigationStack}
        options={{
          tabBarIcon: ({ focused, color }) => <MyLinksIcon color={focused ? "#102D4F" : "#E6E6E6"} fill={focused ? color : "none"} />,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color, fontSize: 14, fontFamily: "Tajawal-Medium" }}>Settings</Text>
              {focused && <View style={dotStyle} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }} >
      <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ title: '' }}
        />
         <Stack.Screen
          name="Walkthrough"
          component={Walkthrough}
          options={{ title: '' }}
        />
      <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: '' }}
        />
      <Stack.Screen
          name="Otp"
          component={OtpScreen}
          options={{ title: '' }}
        />
      <Stack.Screen
          name="EmailLogin"
          component={EmailLogin}
          options={{ title: '' }}
        />
      <Stack.Screen
          name="RegisterUser"
          component={Register}
          options={{ title: '' }}
        />
         <Stack.Screen
          name="ECPLinking"
          component={ECPLinking}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="ECPLOption"
          component={ECPLOption}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="OcrTest"
          component={OcrTest}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="HomeBase"
          options={{ headerShown: false }}
          component={MainTabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


const dotStyle = {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: "#FEBA12",
  marginTop: 1,
};

export default MainNavigation
