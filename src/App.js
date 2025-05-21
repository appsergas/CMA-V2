import 'react-native-gesture-handler'
import React,{ Component } from 'react'
import MainNavigation from './navigation/navigation'
import { Provider } from 'react-redux'
import { store } from './stores'
import { Alert, AppState, BackHandler, Linking, Platform } from 'react-native'
import { LogBox } from "react-native";
import withApiConnector from './services/api/data/data/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
//import crashlytics  from '@react-native-firebase/crashlytics'





LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs()

require('react-native').LogBox.ignoreAllLogs() // console.disableYellowBox = true

// const App = () => {
//   return (
//     <>
//       <Provider store={store}>
//         <MainNavigation />
//       </Provider>
//     </>
//   )
// }



class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      appState: AppState.currentState,
      versionCheckCalled: false
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      // return true
      Alert.alert(
          'Exit App',
          'Exiting the application?', [{
              text: 'Cancel',
              onPress: () => {

              },
              style: 'cancel'
          }, {
              text: 'OK',
              onPress: () => BackHandler.exitApp()
          },], {
          cancelable: false
      }
      )
      return true;
  });
    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          
          this.setState({
            versionCheckCalled: true
          }, () => {
            //crashlytics().log('crash');
            this.props.getAppVersion({"app_name": "sergas_customer"})
          })
        }
        this.setState({ appState: nextAppState });
      },
    );
    this.setState({
      versionCheckCalled: true
    }, () => {
      this.props.getAppVersion({"app_name": "sergas_customer"})
    })
  }

  componentWillReceiveProps(nextProps) {
    const { getAppVersionResult } = nextProps
    if (this.state.versionCheckCalled) {
      this.setState({
        versionCheckCalled: false
      }, () => {
        if (getAppVersionResult && getAppVersionResult.content && getAppVersionResult.content.version) {
          if (Platform.OS == 'android') {
            if (parseFloat(getAppVersionResult.content.version.ANDROID) > 0.31) {
              this.showUpdateModal()
            }
          } else {
            if (parseFloat(getAppVersionResult.content.version.IOS) > 0.31) {
              this.showUpdateModal()
            }
          }
        }
      })
    }
  }

  showUpdateModal = () => {
    Alert.alert('Update available', 'Version is out of date, please update', [
      { text: 'OK', onPress: () => {
        if (Platform.OS == 'android') {
          Linking.openURL("https://play.google.com/store/apps/details?id=com.sergas.customer")
        } else {
          const link = 'https://apps.apple.com/id/app/sergas-group/id1641489055'
          Linking.canOpenURL(link).then(supported => {
            supported && Linking.openURL(link);
          }, (err) => {});
        }
      } },
    ]);
  }
  
  handleBackButton = () => {
    // return true
    Alert.alert(
        'Exit App',
        'Exiting the application?', [{
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel'
        }, {
            text: 'OK',
            onPress: () => BackHandler.exitApp()
        }, ], {
            cancelable: false
        }
     )
     return true;
   } 


  render() {
    return (
    <>
      <Provider store={store}>
        <MainNavigation />
      </Provider>
    </>
    )
  }
}

export default (withApiConnector(App, {
  methods: {
    getAppVersion: {
      type: 'get',
      moduleName: 'api',
      url: 'getAppVersion',
      authenticate: false,
    },
  }
}))
