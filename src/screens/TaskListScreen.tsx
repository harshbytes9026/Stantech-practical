import {databaseService} from '@/services/database';
import {NotificationService} from '@/services/notifications';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {
  setError,
  setLoading,
  setSearchQuery,
  setTasks,
} from '@/store/slices/tasksSlice';
import {colors} from '@/theme/colors';
import {Task} from '@/types/Task';
import {formatDate} from '@/utils/dateUtils';
import {Ionicons} from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface TaskListScreenProps {
  navigation: any;
}

const TaskListScreen: React.FC<TaskListScreenProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {tasks, filteredTasks, loading, searchQuery} = useAppSelector(
    state => state.tasks,
  );
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    await setupNotifications();
    await loadTasks();
  };

  useEffect(() => {
    loadData();
  }, []);

  const setupNotifications = async () => {
    try {
      await NotificationService.registerForPushNotificationsAsync();

      // Add notification listeners
      NotificationService.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
        Alert.alert(
          'New Notification',
          notification.request.content.body || 'You have a new notification',
          [{text: 'OK'}],
        );
      });

      NotificationService.addNotificationResponseReceivedListener(response => {
        console.log('Notification response:', response);
        const data = response.notification.request.content.data;
        if (data?.taskId) {
          // Navigate to specific task if taskId is provided
          navigation.navigate('TaskDetail', {taskId: data.taskId});
        }
      });
    } catch (error) {
      console.error('Failed to setup notifications:', error);
    }
  };

  const loadTasks = async () => {
    try {
      dispatch(setLoading(true));
      const tasks = await databaseService.getAllTasks();
      dispatch(setTasks(tasks));
    } catch (error) {
      dispatch(setError('Failed to load tasks'));
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', {task});
  };

  const handleAddTask = () => {
    navigation.navigate('TaskDetail', {});
  };

  const handleTestNotification = async () => {
    await NotificationService.sendTestNotification();
  };

  const renderTask = ({item}: {item: Task}) => (
    <TouchableOpacity
      style={[styles.taskItem, item.completed && styles.completedTask]}
      onPress={() => handleTaskPress(item)}>
      <View style={styles.taskContent}>
        <Text
          style={[styles.taskTitle, item.completed && styles.completedText]}>
          {item.title}
        </Text>
        {item.description && (
          <Text
            style={[
              styles.taskDescription,
              item.completed && styles.completedText,
            ]}>
            {item.description}
          </Text>
        )}
        <Text style={styles.taskDate}>
          Updated {formatDate(item.updatedAt)}
        </Text>
      </View>
      <View style={styles.taskActions}>
        {item.completed && (
          <Ionicons name="checkmark-circle" size={24} color={colors.green} />
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.grey666} />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-circle-outline" size={64} color={colors.ccc} />
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptyDescription}>
        Tap the + button to create your first task
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <TouchableOpacity
          onPress={handleTestNotification}
          style={styles.testButton}>
          <Ionicons name="notifications" size={24} color={colors.blue007AFF} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.grey666}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={colors.grey666}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch('')}
            style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.grey666} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={
          filteredTasks.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.f5f5f5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.grey3,
  },
  testButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.grey3,
  },
  clearButton: {
    padding: 4,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.grey666,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.grey999,
    textAlign: 'center',
    lineHeight: 24,
  },
  taskItem: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey3,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.grey999,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.grey666,
    marginBottom: 8,
  },
  taskDate: {
    fontSize: 12,
    color: colors.grey999,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.blue007AFF,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default TaskListScreen;
