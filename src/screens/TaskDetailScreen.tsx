import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {addTask, updateTask, deleteTask} from '@/store/slices/tasksSlice';
import {databaseService} from '@/services/database';
import {Task, CreateTaskData, UpdateTaskData} from '@/types/Task';
import {validateTaskTitle, validateTaskDescription} from '@/utils/validation';
import {formatDateTime} from '@/utils/dateUtils';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '@/theme/colors';

interface TaskDetailScreenProps {
  navigation: any;
  route: {
    params: {
      task?: Task;
      taskId?: string;
    };
  };
}

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const {tasks} = useAppSelector(state => state.tasks);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const task =
    route.params?.task || tasks.find(t => t.id === route.params?.taskId);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCompleted(task.completed);
      setIsEditing(true);
      navigation.setOptions({
        title: 'Edit Task',
        headerRight: () => (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash" size={24} color={colors.red} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        title: 'New Task',
      });
    }
  }, [task, navigation]);

  const validateForm = (): boolean => {
    const titleValidation = validateTaskTitle(title);
    const descriptionValidation = validateTaskDescription(description);

    setTitleError(titleValidation);
    setDescriptionError(descriptionValidation);

    return !titleValidation && !descriptionValidation;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEditing && task) {
        const updateData: UpdateTaskData = {
          id: task.id,
          title: title.trim(),
          description: description.trim() || undefined,
          completed,
        };

        const updatedTask = await databaseService.updateTask(updateData);
        dispatch(updateTask(updatedTask));

        Alert.alert('Success', 'Task updated successfully');
      } else {
        const createData: CreateTaskData = {
          title: title.trim(),
          description: description.trim() || undefined,
        };

        const newTask = await databaseService.createTask(createData);
        dispatch(addTask(newTask));

        Alert.alert('Success', 'Task created successfully');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save task:', error);
      Alert.alert('Error', 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await databaseService.deleteTask(task.id);
            dispatch(deleteTask(task.id));
            Alert.alert('Success', 'Task deleted successfully');
            navigation.goBack();
          } catch (error) {
            console.error('Failed to delete task:', error);
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
  };

  const handleToggleComplete = () => {
    setCompleted(!completed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {isEditing && task && (
              <View style={styles.taskInfo}>
                <Text style={styles.infoLabel}>Created</Text>
                <Text style={styles.infoValue}>
                  {formatDateTime(task.createdAt)}
                </Text>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>
                  {formatDateTime(task.updatedAt)}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.input, titleError ? styles.inputError : {}]}
                value={title}
                onChangeText={text => {
                  setTitle(text);
                  if (titleError) {
                    setTitleError(null);
                  }
                }}
                placeholder="Enter task title"
                placeholderTextColor={colors.grey999}
                maxLength={100}
              />
              {titleError && <Text style={styles.errorText}>{titleError}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.textArea,
                  descriptionError ? styles.inputError : {},
                ]}
                value={description}
                onChangeText={text => {
                  setDescription(text);
                  if (descriptionError) {
                    setDescriptionError(null);
                  }
                }}
                placeholder="Enter task description (optional)"
                placeholderTextColor={colors.grey999}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />
              {descriptionError && (
                <Text style={styles.errorText}>{descriptionError}</Text>
              )}
              <Text style={styles.characterCount}>
                {description.length}/500 characters
              </Text>
            </View>

            {isEditing && (
              <TouchableOpacity
                style={[
                  styles.checkboxContainer,
                  completed && styles.checkboxChecked,
                ]}
                onPress={handleToggleComplete}>
                <Ionicons
                  name={completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={completed ? colors.green : colors.grey666}
                />
                <Text
                  style={[
                    styles.checkboxLabel,
                    completed && styles.checkboxLabelChecked,
                  ]}>
                  Mark as completed
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.f5f5f5,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  taskInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.grey666,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: colors.grey3,
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey3,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.grey3,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.grey3,
    minHeight: 100,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 14,
    marginTop: 4,
  },
  characterCount: {
    color: colors.grey999,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxChecked: {
    backgroundColor: 'white',
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.grey3,
    marginLeft: 12,
  },
  checkboxLabelChecked: {
    color: colors.green,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.blue007AFF,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.ccc,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
});

export default TaskDetailScreen;
