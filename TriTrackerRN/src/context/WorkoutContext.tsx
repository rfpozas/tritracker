import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Workout, WorkoutType, AnalyticsPeriod} from '../types/Workout';

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  workoutsForPeriod: (period: AnalyticsPeriod, type?: WorkoutType) => Workout[];
  totalDistance: (period: AnalyticsPeriod, type?: WorkoutType) => number;
  totalDuration: (period: AnalyticsPeriod, type?: WorkoutType) => number;
  totalCalories: (period: AnalyticsPeriod, type?: WorkoutType) => number;
  averageHeartRate: (period: AnalyticsPeriod, type?: WorkoutType) => number;
  averageWattage: (period: AnalyticsPeriod, type?: WorkoutType) => number;
  workoutCount: (period: AnalyticsPeriod, type?: WorkoutType) => number;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEY = '@tritracker_workouts';

export const WorkoutProvider = ({children}: {children: ReactNode}) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const workoutsWithDates = parsed.map((w: any) => ({
          ...w,
          date: new Date(w.date),
        }));
        setWorkouts(workoutsWithDates);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const saveWorkouts = async (newWorkouts: Workout[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newWorkouts));
    } catch (error) {
      console.error('Error saving workouts:', error);
    }
  };

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
    };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    saveWorkouts(updated);
  };

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    saveWorkouts(updated);
  };

  const workoutsForPeriod = (period: AnalyticsPeriod, type?: WorkoutType): Workout[] => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case AnalyticsPeriod.DAILY:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case AnalyticsPeriod.WEEKLY:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case AnalyticsPeriod.MONTHLY:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case AnalyticsPeriod.YEARLY:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    return workouts.filter(workout => {
      if (workout.date < startDate) return false;
      if (type && workout.type !== type) return false;
      return true;
    });
  };

  const totalDistance = (period: AnalyticsPeriod, type?: WorkoutType): number => {
    return workoutsForPeriod(period, type).reduce((sum, w) => sum + w.distance, 0);
  };

  const totalDuration = (period: AnalyticsPeriod, type?: WorkoutType): number => {
    return workoutsForPeriod(period, type).reduce((sum, w) => sum + w.duration, 0);
  };

  const totalCalories = (period: AnalyticsPeriod, type?: WorkoutType): number => {
    return workoutsForPeriod(period, type).reduce((sum, w) => sum + w.calories, 0);
  };

  const averageHeartRate = (period: AnalyticsPeriod, type?: WorkoutType): number => {
    const filtered = workoutsForPeriod(period, type).filter(w => w.averageHeartRate > 0);
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((sum, w) => sum + w.averageHeartRate, 0);
    return sum / filtered.length;
  };

  const averageWattage = (period: AnalyticsPeriod, type?: WorkoutType): number => {
    const filtered = workoutsForPeriod(period, type).filter(w => w.averageWattage > 0);
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((sum, w) => sum + w.averageWattage, 0);
    return sum / filtered.length;
  };

  const workoutCount = (period: AnalyticsPeriod, type?: WorkoutType): number => {
    return workoutsForPeriod(period, type).length;
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        deleteWorkout,
        workoutsForPeriod,
        totalDistance,
        totalDuration,
        totalCalories,
        averageHeartRate,
        averageWattage,
        workoutCount,
      }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within WorkoutProvider');
  }
  return context;
};

