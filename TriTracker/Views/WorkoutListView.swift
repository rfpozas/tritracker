import SwiftUI

struct WorkoutListView: View {
    @EnvironmentObject var workoutViewModel: WorkoutViewModel
    @State private var showingAddWorkout = false
    
    var body: some View {
        NavigationView {
            List {
                ForEach(workoutViewModel.workouts, id: \.id) { workout in
                    NavigationLink(destination: WorkoutDetailView(workout: workout)) {
                        WorkoutRowView(workout: workout)
                    }
                }
                .onDelete(perform: deleteWorkouts)
            }
            .navigationTitle("Triathlon Tracker")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddWorkout = true }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddWorkout) {
                AddWorkoutView()
            }
        }
    }
    
    private func deleteWorkouts(offsets: IndexSet) {
        for index in offsets {
            workoutViewModel.deleteWorkout(workoutViewModel.workouts[index])
        }
    }
}

struct WorkoutRowView: View {
    let workout: Workout
    
    var body: some View {
        HStack {
            if let type = workout.workoutType {
                Image(systemName: type.icon)
                    .foregroundColor(colorForType(type))
                    .font(.title2)
                    .frame(width: 40)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(workout.workoutType?.rawValue ?? "Unknown")
                    .font(.headline)
                
                Text(workout.dateValue, style: .date)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text(workout.formattedDistance)
                    .font(.headline)
                
                Text(workout.formattedDuration)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
    
    private func colorForType(_ type: WorkoutType) -> Color {
        switch type {
        case .run: return .red
        case .bike: return .blue
        case .swim: return .cyan
        }
    }
}

#Preview {
    WorkoutListView()
        .environmentObject(WorkoutViewModel(context: PersistenceController.preview.container.viewContext))
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}





