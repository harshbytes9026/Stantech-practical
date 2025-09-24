# Task Tracker App

A cross-platform React Native app that demonstrates offline data persistence with SQLite, global state management with Redux Toolkit, and Firebase push notifications.

## 🚀 Features

- **Task Management**: Create, read, update, and delete tasks
- **Offline Persistence**: SQLite database for local data storage
- **State Management**: Redux Toolkit for global state management
- **Push Notifications**: Firebase notifications with Expo
- **Search & Filter**: Search tasks by title
- **Clean Architecture**: Modular and maintainable code structure
- **Form Validation**: Input validation with error handling
- **Responsive UI**: Clean and intuitive user interface

## 📱 Screens

### Task List Screen
- Display all tasks with title, description, and last updated time
- Search/filter functionality
- Pull-to-refresh
- Floating action button to add new tasks
- Test notification button

### Add/Edit Task Screen
- Create new tasks with title (required) and description (optional)
- Edit existing tasks
- Mark tasks as completed
- Delete tasks with confirmation
- Form validation with real-time error feedback

## 🛠️ Technical Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type safety and better development experience
- **Redux Toolkit**: State management
- **SQLite**: Local database (expo-sqlite)
- **Firebase**: Push notifications (expo-notifications)
- **React Navigation**: Navigation between screens
- **Expo Vector Icons**: Icon library

## 📦 Dependencies

### Core Dependencies
```json
{
  "expo": "~49.0.15",
  "react": "18.2.0",
  "react-native": "0.72.6",
  "@reduxjs/toolkit": "^1.9.7",
  "react-redux": "^8.1.3",
  "expo-sqlite": "~11.3.3",
  "expo-notifications": "~0.20.1"
}
```

### Navigation
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "react-native-screens": "~3.22.0",
  "react-native-safe-area-context": "4.6.3",
  "react-native-gesture-handler": "~2.12.0"
}
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platforms**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔧 Key Features Implementation

### SQLite Database
- **Database Service**: Centralized database operations
- **Task Schema**: ID, title, description, timestamps, completion status
- **CRUD Operations**: Create, read, update, delete tasks
- **Search Functionality**: Search tasks by title or description

### Redux State Management
- **Redux Toolkit**: Modern Redux with less boilerplate
- **Tasks Slice**: Manages task state and actions
- **Typed Hooks**: Type-safe Redux hooks
- **Async Operations**: Handles database operations with loading states

### Push Notifications
- **Expo Notifications**: Cross-platform notification handling
- **Permission Management**: Request and handle notification permissions
- **Notification Listeners**: Handle received and response notifications
- **Test Notifications**: Built-in test notification functionality

### Form Validation
- **Real-time Validation**: Validate inputs as user types
- **Error Handling**: Display validation errors with helpful messages
- **Character Limits**: Enforce title and description length limits
- **Required Fields**: Ensure required fields are filled

## 🎨 UI/UX Features

- **Clean Design**: Modern, intuitive interface
- **Responsive Layout**: Works on different screen sizes
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Pull-to-Refresh**: Refresh task list by pulling down
- **Search**: Real-time search with clear functionality
- **Empty States**: Helpful messages when no tasks exist

## 🔍 Search & Filter

- **Real-time Search**: Search tasks as you type
- **Case-insensitive**: Search works regardless of case
- **Title & Description**: Search in both title and description
- **Clear Search**: Easy way to clear search and show all tasks

## 📱 Platform Support

- **iOS**: Full support with native navigation
- **Android**: Full support with Material Design elements
- **Web**: Basic support for testing (limited functionality)

### Database Configuration
The SQLite database is automatically initialized when the app starts. The database file is stored locally on the device.

## 📊 Performance Considerations

- **SQLite**: Fast local database operations
- **Redux**: Efficient state management with minimal re-renders
- **Lazy Loading**: Components are loaded only when needed
- **Memory Management**: Proper cleanup of listeners and subscriptions
