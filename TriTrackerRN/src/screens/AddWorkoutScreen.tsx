import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
// Note: Install @react-native-community/datetimepicker
// For now, using a simple text input for date
// import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import {useWorkouts} from '../context/WorkoutContext';
import {WorkoutType} from '../types/Workout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddWorkoutScreen = () => {
  const navigation = useNavigation();
  const {addWorkout} = useWorkouts();

  const [selectedType, setSelectedType] = useState<WorkoutType>(WorkoutType.RUN);
  const [date, setDate] = useState(new Date());
  const [dateInput, setDateInput] = useState(
    new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  );
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');
  const [averageHeartRate, setAverageHeartRate] = useState('');
  const [averageWattage, setAverageWattage] = useState('');

  const handleSave = () => {
    if (!distance || parseFloat(distance) <= 0) {
      alert('Please enter a valid distance');
      return;
    }

    const duration = hours * 3600 + minutes * 60 + seconds;
    const distanceValue = parseFloat(distance);
    const distanceInKm = selectedType === WorkoutType.SWIM ? distanceValue / 1000 : distanceValue;

    addWorkout({
      type: selectedType,
      date,
      duration,
      distance: distanceInKm,
      calories: parseInt(calories) || 0,
      averageHeartRate: parseInt(averageHeartRate) || 0,
      averageWattage: parseInt(averageWattage) || 0,
    });

    navigation.goBack();
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Type</Text>
        <View style={styles.typeContainer}>
          {Object.values(WorkoutType).map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                selectedType === type && {
                  backgroundColor: getTypeColor(type),
                  borderColor: getTypeColor(type),
                },
              ]}
              onPress={() => setSelectedType(type)}>
              <Icon
                name={getTypeIcon(type)}
                size={24}
                color={selectedType === type ? '#fff' : '#000'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === type && styles.typeButtonTextSelected,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date & Time</Text>
        <Text style={styles.dateHint}>
          Current date/time will be used. To change, modify the date input below:
        </Text>
        <TextInput
          style={styles.dateInput}
          placeholder="MM/DD/YYYY HH:MM (e.g., 12/25/2024 14:30)"
          value={dateInput}
          onChangeText={text => {
            setDateInput(text);
            // Try to parse the date
            const parsed = new Date(text);
            if (!isNaN(parsed.getTime())) {
              setDate(parsed);
            }
          }}
        />
        <Text style={styles.currentDate}>
          Using: {date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Duration</Text>
        <View style={styles.durationContainer}>
          <View style={styles.durationPicker}>
            <Text style={styles.durationLabel}>Hours</Text>
            <View style={styles.pickerRow}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setHours(Math.max(0, hours - 1))}>
                <Text style={styles.pickerButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.pickerValue}>{hours}</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setHours(Math.min(23, hours + 1))}>
                <Text style={styles.pickerButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.durationPicker}>
            <Text style={styles.durationLabel}>Minutes</Text>
            <View style={styles.pickerRow}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setMinutes(Math.max(0, minutes - 1))}>
                <Text style={styles.pickerButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.pickerValue}>{minutes}</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setMinutes(Math.min(59, minutes + 1))}>
                <Text style={styles.pickerButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.durationPicker}>
            <Text style={styles.durationLabel}>Seconds</Text>
            <View style={styles.pickerRow}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setSeconds(Math.max(0, seconds - 1))}>
                <Text style={styles.pickerButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.pickerValue}>{seconds}</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setSeconds(Math.min(59, seconds + 1))}>
                <Text style={styles.pickerButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distance</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Distance in ${selectedType === WorkoutType.SWIM ? 'meters' : 'km'}`}
            value={distance}
            onChangeText={setDistance}
            keyboardType="decimal-pad"
          />
          <Text style={styles.inputUnit}>
            {selectedType === WorkoutType.SWIM ? 'm' : 'km'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <TextInput
          style={styles.input}
          placeholder="Calories (optional)"
          value={calories}
          onChangeText={setCalories}
          keyboardType="number-pad"
        />
        <TextInput
          style={[styles.input, styles.inputMargin]}
          placeholder="Average Heart Rate - BPM (optional)"
          value={averageHeartRate}
          onChangeText={setAverageHeartRate}
          keyboardType="number-pad"
        />
        <TextInput
          style={[styles.input, styles.inputMargin]}
          placeholder="Average Wattage - W (optional)"
          value={averageWattage}
          onChangeText={setAverageWattage}
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  typeButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  dateHint: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  dateInput: {
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  currentDate: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationPicker: {
    flex: 1,
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  pickerButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  pickerValue: {
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  inputUnit: {
    marginLeft: 8,
    fontSize: 16,
    color: '#8E8E93',
  },
  inputMargin: {
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddWorkoutScreen;

