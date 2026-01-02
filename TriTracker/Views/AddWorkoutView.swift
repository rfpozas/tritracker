import SwiftUI

struct AddWorkoutView: View {
    @Environment(\.managedObjectContext) private var viewContext
    @EnvironmentObject var workoutViewModel: WorkoutViewModel
    @Environment(\.dismiss) var dismiss
    
    @State private var selectedType: WorkoutType = .run
    @State private var date = Date()
    @State private var hours: Int = 0
    @State private var minutes: Int = 30
    @State private var seconds: Int = 0
    @State private var distance: String = ""
    @State private var calories: String = ""
    @State private var averageHeartRate: String = ""
    @State private var averageWattage: String = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Workout Type")) {
                    Picker("Type", selection: $selectedType) {
                        ForEach(WorkoutType.allCases) { type in
                            HStack {
                                Image(systemName: type.icon)
                                Text(type.rawValue)
                            }
                            .tag(type)
                        }
                    }
                }
                
                Section(header: Text("Date & Time")) {
                    DatePicker("Date", selection: $date, displayedComponents: [.date, .hourAndMinute])
                }
                
                Section(header: Text("Duration")) {
                    HStack {
                        Picker("Hours", selection: $hours) {
                            ForEach(0..<24) { hour in
                                Text("\(hour)").tag(hour)
                            }
                        }
                        .pickerStyle(.wheel)
                        .frame(width: 80)
                        
                        Text("h")
                            .foregroundColor(.secondary)
                        
                        Picker("Minutes", selection: $minutes) {
                            ForEach(0..<60) { minute in
                                Text("\(minute)").tag(minute)
                            }
                        }
                        .pickerStyle(.wheel)
                        .frame(width: 80)
                        
                        Text("m")
                            .foregroundColor(.secondary)
                        
                        Picker("Seconds", selection: $seconds) {
                            ForEach(0..<60) { second in
                                Text("\(second)").tag(second)
                            }
                        }
                        .pickerStyle(.wheel)
                        .frame(width: 80)
                        
                        Text("s")
                            .foregroundColor(.secondary)
                    }
                }
                
                Section(header: Text("Distance")) {
                    HStack {
                        TextField("Distance", text: $distance)
                            .keyboardType(.decimalPad)
                        Text(selectedType == .swim ? "meters" : "km")
                            .foregroundColor(.secondary)
                    }
                }
                
                Section(header: Text("Performance Metrics")) {
                    HStack {
                        Text("Calories")
                        Spacer()
                        TextField("Calories", text: $calories)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                    }
                    
                    HStack {
                        Text("Avg Heart Rate")
                        Spacer()
                        TextField("BPM", text: $averageHeartRate)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                    }
                    
                    HStack {
                        Text("Avg Wattage")
                        Spacer()
                        TextField("Watts", text: $averageWattage)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                    }
                }
            }
            .navigationTitle("Add Workout")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveWorkout()
                    }
                    .disabled(!isValidInput)
                }
            }
        }
    }
    
    private var isValidInput: Bool {
        guard let distanceValue = Double(distance), distanceValue > 0 else { return false }
        return true
    }
    
    private func saveWorkout() {
        let duration = TimeInterval(hours * 3600 + minutes * 60 + seconds)
        let distanceValue = Double(distance) ?? 0.0
        let caloriesValue = Int32(calories) ?? 0
        let heartRateValue = Int32(averageHeartRate) ?? 0
        let wattageValue = Int32(averageWattage) ?? 0
        
        // Convert distance to km for swim (input is in meters)
        let distanceInKm = selectedType == .swim ? distanceValue / 1000.0 : distanceValue
        
        workoutViewModel.addWorkout(
            type: selectedType,
            date: date,
            duration: duration,
            distance: distanceInKm,
            calories: caloriesValue,
            averageHeartRate: heartRateValue,
            averageWattage: wattageValue
        )
        
        dismiss()
    }
}

#Preview {
    AddWorkoutView()
        .environmentObject(WorkoutViewModel(context: PersistenceController.preview.container.viewContext))
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}

