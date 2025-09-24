import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'expo-status-bar';
import {store} from '@/store';
import {databaseService} from '@/services/database';
import TaskListScreen from '@/screens/TaskListScreen';
import TaskDetailScreen from '@/screens/TaskDetailScreen';
import {colors} from '@/theme/colors';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await databaseService.init();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="TaskList"
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.blue007AFF,
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="TaskList"
            component={TaskListScreen}
            options={{
              title: 'Task Tracker',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{
              title: 'Task Detail',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
