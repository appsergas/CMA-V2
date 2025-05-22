import { Notifications } from 'react-native-notifications';

const postLocalNotification = (title, message, screen) => {
  Notifications.postLocalNotification({
    title: title,
    body: message,
    sound: "default",
    silent: false,
    userInfo: {
      screen: screen,
      title: title,
      body: message,
    },
  });
};

export default postLocalNotification;
