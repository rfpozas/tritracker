import SwiftUI

struct WorkoutDetailView: View {
    let workout: Workout
    
    var body: some View {
        Form {
            Section(header: Text("Workout Information")) {
                if let type = workout.workoutType {
                    HStack {
                        Text("Type")
                        Spacer()
                        HStack {
                            Image(systemName: type.icon)
                            Text(type.rawValue)
                        }
                        .foregroundColor(.secondary)
                    }
                }
                
                HStack {
                    Text("Date")
                    Spacer()
                    Text(workout.dateValue, style: .date)
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    Text("Time")
                    Spacer()
                    Text(workout.dateValue, style: .time)
                        .foregroundColor(.secondary)
                }
            }
            
            Section(header: Text("Performance")) {
                HStack {
                    Text("Duration")
                    Spacer()
                    Text(workout.formattedDuration)
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    Text("Distance")
                    Spacer()
                    Text(workout.formattedDistance)
                        .foregroundColor(.secondary)
                }
                
                HStack {
                    Text("Calories")
                    Spacer()
                    Text("\(workout.calories)")
                        .foregroundColor(.secondary)
                }
                
                if workout.averageHeartRate > 0 {
                    HStack {
                        Text("Avg Heart Rate")
                        Spacer()
                        Text("\(workout.averageHeartRate) BPM")
                            .foregroundColor(.secondary)
                    }
                }
                
                if workout.averageWattage > 0 {
                    HStack {
                        Text("Avg Wattage")
                        Spacer()
                        Text("\(workout.averageWattage) W")
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .navigationTitle("Workout Details")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationView {
        WorkoutDetailView(workout: PersistenceController.preview.container.viewContext.registeredObjects.first(where: { $0 is Workout }) as! Workout)
    }
}

