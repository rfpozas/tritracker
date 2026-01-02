import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Workout, WorkoutType} from '../types/Workout';

interface WorkoutDetailScreenProps {
  route: {
    params: {
      workout: Workout;
    };
  };
}

const WorkoutDetailScreen = ({route}: WorkoutDetailScreenProps) => {
  const {workout} = route.params;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, {backgroundColor: getTypeColor(workout.type)}]}>
          <Icon name={getTypeIcon(workout.type)} size={48} color="#fff" />
        </View>
        <Text style={styles.workoutType}>{workout.type}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>{formatDate(workout.date)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time</Text>
          <Text style={styles.infoValue}>{formatTime(workout.date)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoValue}>{formatDuration(workout.duration)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>{formatDistance(workout.distance, workout.type)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Calories</Text>
          <Text style={styles.infoValue}>{workout.calories}</Text>
        </View>
        {workout.averageHeartRate > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Avg Heart Rate</Text>
            <Text style={styles.infoValue}>{workout.averageHeartRate} BPM</Text>
          </View>
        )}
        {workout.averageWattage > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Avg Wattage</Text>
            <Text style={styles.infoValue}>{workout.averageWattage} W</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutType: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  infoLabel: {
    fontSize: 16,
    color: '#000',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
});

export default WorkoutDetailScreen;





