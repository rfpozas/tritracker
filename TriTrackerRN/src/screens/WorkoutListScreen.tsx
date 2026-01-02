import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useWorkouts} from '../context/WorkoutContext';
import {Workout, WorkoutType} from '../types/Workout';

type RootStackParamList = {
  AddWorkout: undefined;
  WorkoutDetail: {workout: Workout};
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WorkoutListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {workouts, deleteWorkout} = useWorkouts();

  const handleDelete = (id: string) => {
    Alert.alert('Delete Workout', 'Are you sure you want to delete this workout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteWorkout(id),
      },
    ]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (distance: number, type: WorkoutType) => {
    if (type === WorkoutType.SWIM) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(2)} km`;
  };

  const getTypeIcon = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.RUN:
        return 'run';
      case WorkoutType.BIKE:
        return 'bicycle';
      case WorkoutType.SWIM:
        return 'swim';
    }
  };

  const getTypeColor = (type: WorkoutType) => {
    switch (type) {
      case WorkoutType.RUN:
        return '#FF3B30';
      case WorkoutType.BIKE:
        return '#007AFF';
      case WorkoutType.SWIM:
        return '#5AC8FA';
    }
  };

  const renderWorkout = ({item}: {item: Workout}) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => navigation.navigate('WorkoutDetail', {workout: item})}
      onLongPress={() => handleDelete(item.id)}>
      <View style={styles.workoutHeader}>
        <View style={[styles.iconContainer, {backgroundColor: getTypeColor(item.type)}]}>
          <Icon name={getTypeIcon(item.type)} size={24} color="#fff" />
        </View>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutType}>{item.type}</Text>
          <Text style={styles.workoutDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.workoutStats}>
          <Text style={styles.distance}>{formatDistance(item.distance, item.type)}</Text>
          <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="dumbbell" size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first workout</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWorkout')}>
        <Icon name="plus" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    padding: 16,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  workoutDate: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  workoutStats: {
    alignItems: 'flex-end',
  },
  distance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  duration: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default WorkoutListScreen;

