import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {WorkoutProvider} from './src/context/WorkoutContext';
import WorkoutListScreen from './src/screens/WorkoutListScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AddWorkoutScreen from './src/screens/AddWorkoutScreen';
import WorkoutDetailScreen from './src/screens/WorkoutDetailScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const WorkoutStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WorkoutList"
        component={WorkoutListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddWorkout"
        component={AddWorkoutScreen}
        options={{
          title: 'Add Workout',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{
          title: 'Workout Details',
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <WorkoutProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
          }}>
          <Tab.Screen
            name="Workouts"
            component={WorkoutStack}
            options={{
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon name="format-list-bulleted" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Analytics"
            component={AnalyticsScreen}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon name="chart-bar" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </WorkoutProvider>
  );
};

export default App;
