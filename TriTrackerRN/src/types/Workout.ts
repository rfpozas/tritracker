export enum WorkoutType {
  RUN = 'Run',
  BIKE = 'Bike',
  SWIM = 'Swim',
}

export interface Workout {
  id: string;
  type: WorkoutType;
  date: Date;
  duration: number; // in seconds
  distance: number; // in km (swim converted from meters)
  calories: number;
  averageHeartRate: number;
  averageWattage: number;
}

export enum AnalyticsPeriod {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}





