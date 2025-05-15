/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { firebase } from '@react-native-firebase/app';

LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs(true)

require('react-native').LogBox.ignoreAllLogs(true)

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyD2O9LLaAgNC_FD1H3LmIPYBPVuIlZ3_jI",
    authDomain: "",
    projectId: "sergas-group",
    appId: "1:905450325836:android:be398d520d87915b6d31e9",
    };
  
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
AppRegistry.registerComponent(appName, () => App)
