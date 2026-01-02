import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useWorkouts} from '../context/WorkoutContext';
import {AnalyticsPeriod, WorkoutType} from '../types/Workout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnalyticsScreen = () => {
  const {
    workoutsForPeriod,
    totalDistance,
    totalDuration,
    totalCalories,
    averageHeartRate,
    averageWattage,
    workoutCount,
  } = useWorkouts();

  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(
    AnalyticsPeriod.WEEKLY,
  );
  const [selectedType, setSelectedType] = useState<WorkoutType | undefined>(
    undefined,
  );

  const formatDistance = (distance: number, type?: WorkoutType) => {
    if (type === WorkoutType.SWIM) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(2)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string;
    icon: string;
    color: string;
  }) => (
    <View style={styles.statCard}>
      <Icon name={icon} size={32} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const workouts = workoutsForPeriod(selectedPeriod, selectedType);
  const distance = totalDistance(selectedPeriod, selectedType);
  const duration = totalDuration(selectedPeriod, selectedType);
  const calories = totalCalories(selectedPeriod, selectedType);
  const avgHR = averageHeartRate(selectedPeriod, selectedType);
  const avgWattage = averageWattage(selectedPeriod, selectedType);
  const count = workoutCount(selectedPeriod, selectedType);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.periodContainer}>
        {Object.values(AnalyticsPeriod).map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}>
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedType === undefined && styles.filterChipActive,
          ]}
          onPress={() => setSelectedType(undefined)}>
          <Text
            style={[
              styles.filterChipText,
              selectedType === undefined && styles.filterChipTextActive,
            ]}>
            All
          </Text>
        </TouchableOpacity>
        {Object.values(WorkoutType).map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              selectedType === type && styles.filterChipActive,
            ]}
            onPress={() => setSelectedType(selectedType === type ? undefined : type)}>
            <Text
              style={[
                styles.filterChipText,
                selectedType === type && styles.filterChipTextActive,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Workouts"
          value={count.toString()}
          icon="dumbbell"
          color="#007AFF"
        />
        <StatCard
          title="Distance"
          value={formatDistance(distance, selectedType)}
          icon="map-marker-distance"
          color="#34C759"
        />
        <StatCard
          title="Time"
          value={formatDuration(duration)}
          icon="clock-outline"
          color="#FF9500"
        />
        <StatCard
          title="Calories"
          value={calories.toString()}
          icon="fire"
          color="#FF3B30"
        />
      </View>

      {count > 0 && (
        <View style={styles.metricsContainer}>
          {avgHR > 0 && (
            <View style={styles.metricRow}>
              <Icon name="heart" size={24} color="#FF2D55" />
              <Text style={styles.metricLabel}>Average Heart Rate</Text>
              <Text style={styles.metricValue}>{Math.round(avgHR)} BPM</Text>
            </View>
          )}
          {avgWattage > 0 && (
            <View style={styles.metricRow}>
              <Icon name="lightning-bolt" size={24} color="#FFD60A" />
              <Text style={styles.metricLabel}>Average Wattage</Text>
              <Text style={styles.metricValue}>{Math.round(avgWattage)} W</Text>
            </View>
          )}
        </View>
      )}

      {selectedType === undefined && (
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>Breakdown by Type</Text>
          {Object.values(WorkoutType).map(type => {
            const typeCount = workoutCount(selectedPeriod, type);
            const typeDistance = totalDistance(selectedPeriod, type);
            return (
              <View key={type} style={styles.breakdownCard}>
                <View style={styles.breakdownHeader}>
                  <Icon
                    name={
                      type === WorkoutType.RUN
                        ? 'run'
                        : type === WorkoutType.BIKE
                        ? 'bicycle'
                        : 'swim'
                    }
                    size={24}
                    color={
                      type === WorkoutType.RUN
                        ? '#FF3B30'
                        : type === WorkoutType.BIKE
                        ? '#007AFF'
                        : '#5AC8FA'
                    }
                  />
                  <Text style={styles.breakdownType}>{type}</Text>
                </View>
                <View style={styles.breakdownStats}>
                  <View>
                    <Text style={styles.breakdownValue}>{typeCount}</Text>
                    <Text style={styles.breakdownLabel}>Workouts</Text>
                  </View>
                  <View>
                    <Text style={styles.breakdownValue}>
                      {formatDistance(typeDistance, type)}
                    </Text>
                    <Text style={styles.breakdownLabel}>Distance</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  periodContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  metricsContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  metricLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  breakdownContainer: {
    padding: 16,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  breakdownStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default AnalyticsScreen;





