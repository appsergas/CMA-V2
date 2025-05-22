import 'react-native-gesture-handler';
import React, { Component } from 'react';
import MainNavigation from './navigation/navigation';
import { Provider } from 'react-redux';
import { store } from './stores';
import { Alert, AppState, BackHandler, Linking, Platform } from 'react-native';
import { LogBox } from 'react-native';
import withApiConnector from './services/api/data/data/api';
import { Notifications } from 'react-native-notifications';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreAllLogs();

// Register for remote notifications
Notifications.registerRemoteNotifications();

// Handle notification tap (foreground & background)
Notifications.events().registerNotificationOpened((notification, completion) => {
  console.log('Notification tapped (background/foreground):', notification);

  const screen = notification?.payload?.screen;
  const title = notification?.payload?.title;
  const body = notification?.payload?.body;
  const id = notification?.payload?.id;

  if (navigationRef.isReady() && screen) {
    navigationRef.navigate(screen, {
      title: title || 'Notification',
      description: body || 'No details available.',
      id: id,
    });
  }

  completion();
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      versionCheckCalled: false,
    };
  }

  componentDidMount() {
    // Handle back button
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    // Handle app state changes
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

    // Initial version check
    this.setState({ versionCheckCalled: true }, () => {
      this.props.getAppVersion({ app_name: 'sergas_customer' });
    });

    // Handle app launch from killed state via notification
    Notifications.getInitialNotification()
      .then((notification) => {
        if (notification) {
          console.log('Notification caused app launch (killed state):', notification);

          const screen = notification?.payload?.screen;
          const title = notification?.payload?.title;
          const body = notification?.payload?.body;
          const id = notification?.payload?.id;

          // Navigate after short delay to ensure NavigationContainer is mounted
          setTimeout(() => {
            if (navigationRef.isReady() && screen) {
              navigationRef.navigate(screen, {
                title,
                description: body,
                id,
              });
            }
          }, 500);
        }
      });
  }

  componentWillUnmount() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillReceiveProps(nextProps) {
    const { getAppVersionResult } = nextProps;
    if (this.state.versionCheckCalled) {
      this.setState({ versionCheckCalled: false }, () => {
        if (
          getAppVersionResult &&
          getAppVersionResult.content &&
          getAppVersionResult.content.version
        ) {
          const versionData = getAppVersionResult.content.version;
          const platformVersion = Platform.OS === 'android' ? versionData.ANDROID : versionData.IOS;

          if (parseFloat(platformVersion) > 0.31) {
            this.showUpdateModal();
          }
        }
      });
    }
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({ versionCheckCalled: true }, () => {
        this.props.getAppVersion({ app_name: 'sergas_customer' });
      });
    }
    this.setState({ appState: nextAppState });
  };

  showUpdateModal = () => {
    Alert.alert('Update available', 'Version is out of date, please update', [
      {
        text: 'OK',
        onPress: () => {
          if (Platform.OS === 'android') {
            Linking.openURL('https://play.google.com/store/apps/details?id=com.sergas.customer');
          } else {
            const link = 'https://apps.apple.com/id/app/sergas-group/id1641489055';
            Linking.canOpenURL(link).then(
              (supported) => {
                if (supported) Linking.openURL(link);
              },
              (err) => {}
            );
          }
        },
      },
    ]);
  };

  handleBackButton = () => {
    Alert.alert('Exit App', 'Exiting the application?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  render() {
    return (
      <Provider store={store}>
        <MainNavigation />
      </Provider>
    );
  }
}

export default withApiConnector(App, {
  methods: {
    getAppVersion: {
      type: 'get',
      moduleName: 'api',
      url: 'getAppVersion',
      authenticate: false,
    },
  },
});
