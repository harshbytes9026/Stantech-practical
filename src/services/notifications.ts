import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import {Platform} from 'react-native';
import { colors } from '@/theme/colors';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.red,
      });
    }

    if (Device.isDevice) {
      const {status: existingStatus} =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      try {
        const projectId = 'demo-project-id';
        if (projectId === 'demo-project-id') {
          console.log('Project ID not found, using mock token for demo');
          token = 'mock-push-token-' + Date.now();
        } else {
          token = (
            await Notifications.getExpoPushTokenAsync({
              projectId: 'demo-project-id',
            })
          ).data;
          console.log('Push token:', token);
        }
      } catch (error) {
        console.error('Error getting push token:', error);
        // For demo purposes, return a mock token
        token = 'mock-push-token-' + Date.now();
      }
    } else {
      console.log('Must use physical device for Push Notifications');
      // For simulator/emulator, return a mock token
      token = 'mock-push-token-' + Date.now();
    }

    return token;
  }

  static async schedulePushNotification(
    title: string,
    body: string,
    data?: any,
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: {seconds: 2},
    });
  }

  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void,
  ) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  static addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void,
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  static async sendTestNotification() {
    await this.schedulePushNotification(
      'Task Tracker',
      'This is a test notification from Task Tracker!',
      {type: 'test'},
    );
  }

  static async sendTaskReminderNotification(taskTitle: string, taskId: string) {
    await this.schedulePushNotification(
      'Task Reminder',
      `Don't forget: ${taskTitle}`,
      {type: 'task_reminder', taskId},
    );
  }
}
