/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { firebase } from '@react-native-firebase/app';
// import messaging from 'react-native-firebase/messaging';
import { CrashlyticsModule } from '@react-native-firebase/app'

// Call the native crash method
//CrashlyticsModule.crash();
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });
// const firebaseConfig = {
//     apiKey: "AIzaSyAD88lmHo_DCz4MnhFbZyhBGvDP-97YCfM",
//     authDomain: "",
//     projectId: "sergas-customer",
//     appId: "1:905450325836:ios:11f5fed04f34a1c86d31e9",
//     };
  
  
//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
//firebase.initializeApp();


LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs(true)

require('react-native').LogBox.ignoreAllLogs(true)

AppRegistry.registerComponent(appName, () => App)
