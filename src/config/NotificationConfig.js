import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {Importance} from 'react-native-push-notification';

PushNotification.createChannel(
  {
    channelId: 'monitor',
    channelName: 'Monitor Temperatura',
    importance: Importance.HIGH,
  },
  create => console.log(`Create channel is ${create}`),
);
// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log('TOKEN:', token);
    PushNotification.subscribeToTopic('monitor');
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
    /* Process the notification firebase */
    PushNotification.localNotification({
      channelId: 'monitor',
      title: notification.data.title,
      message: notification.data.body,
      largeIcon: '',
      showWhen: true,
      when: new Date().getTime(),
      //smallIcon: 'ic_launcher',
    });

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function(notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});
