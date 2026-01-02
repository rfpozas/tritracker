import SwiftUI

struct AnalyticsView: View {
    @EnvironmentObject var workoutViewModel: WorkoutViewModel
    @State private var selectedPeriod: AnalyticsPeriod = .weekly
    @State private var selectedType: WorkoutType? = nil
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Period Picker
                    Picker("Period", selection: $selectedPeriod) {
                        ForEach(AnalyticsPeriod.allCases, id: \.self) { period in
                            Text(period.rawValue).tag(period)
                        }
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal)
                    
                    // Type Filter
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            FilterChip(title: "All", isSelected: selectedType == nil) {
                                selectedType = nil
                            }
                            
                            ForEach(WorkoutType.allCases) { type in
                                FilterChip(
                                    title: type.rawValue,
                                    isSelected: selectedType == type
                                ) {
                                    selectedType = selectedType == type ? nil : type
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                    .padding(.vertical, 8)
                    
                    // Statistics Cards
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                        StatCard(
                            title: "Workouts",
                            value: "\(workoutViewModel.workoutCount(for: selectedPeriod, type: selectedType))",
                            icon: "figure.run",
                            color: .blue
                        )
                        
                        StatCard(
                            title: "Total Distance",
                            value: formatDistance(workoutViewModel.totalDistance(for: selectedPeriod, type: selectedType), type: selectedType),
                            icon: "map",
                            color: .green
                        )
                        
                        StatCard(
                            title: "Total Time",
                            value: formatDuration(workoutViewModel.totalDuration(for: selectedPeriod, type: selectedType)),
                            icon: "clock",
                            color: .orange
                        )
                        
                        StatCard(
                            title: "Total Calories",
                            value: "\(workoutViewModel.totalCalories(for: selectedPeriod, type: selectedType))",
                            icon: "flame",
                            color: .red
                        )
                    }
                    .padding(.horizontal)
                    
                    // Additional Metrics
                    if workoutViewModel.workoutCount(for: selectedPeriod, type: selectedType) > 0 {
                        VStack(spacing: 16) {
                            if workoutViewModel.averageHeartRate(for: selectedPeriod, type: selectedType) > 0 {
                                MetricRow(
                                    title: "Average Heart Rate",
                                    value: String(format: "%.0f BPM", workoutViewModel.averageHeartRate(for: selectedPeriod, type: selectedType)),
                                    icon: "heart.fill",
                                    color: .pink
                                )
                            }
                            
                            if workoutViewModel.averageWattage(for: selectedPeriod, type: selectedType) > 0 {
                                MetricRow(
                                    title: "Average Wattage",
                                    value: String(format: "%.0f W", workoutViewModel.averageWattage(for: selectedPeriod, type: selectedType)),
                                    icon: "bolt.fill",
                                    color: .yellow
                                )
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // Workout Breakdown by Type
                    if selectedType == nil {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Breakdown by Type")
                                .font(.headline)
                                .padding(.horizontal)
                            
                            ForEach(WorkoutType.allCases) { type in
                                TypeBreakdownCard(
                                    type: type,
                                    period: selectedPeriod,
                                    workoutViewModel: workoutViewModel
                                )
                            }
                        }
                        .padding(.top)
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("Analytics")
        }
    }
    
    private func formatDistance(_ distance: Double, type: WorkoutType?) -> String {
        if let type = type {
            switch type {
            case .run, .bike:
                return String(format: "%.2f km", distance)
            case .swim:
                return String(format: "%.0f m", distance * 1000)
            }
        } else {
            // For "All", show in km
            return String(format: "%.2f km", distance)
        }
    }
    
    private func formatDuration(_ duration: TimeInterval) -> String {
        let hours = Int(duration) / 3600
        let minutes = (Int(duration) % 3600) / 60
        
        if hours > 0 {
            return "\(hours)h \(minutes)m"
        } else {
            return "\(minutes)m"
        }
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color.blue : Color.gray.opacity(0.2))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(20)
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                Spacer()
            }
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct MetricRow: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(color)
                .frame(width: 30)
            
            Text(title)
                .font(.subheadline)
            
            Spacer()
            
            Text(value)
                .font(.headline)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct TypeBreakdownCard: View {
    let type: WorkoutType
    let period: AnalyticsPeriod
    let workoutViewModel: WorkoutViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: type.icon)
                    .foregroundColor(colorForType(type))
                Text(type.rawValue)
                    .font(.headline)
                Spacer()
            }
            
            HStack(spacing: 20) {
                VStack(alignment: .leading) {
                    Text("\(workoutViewModel.workoutCount(for: period, type: type))")
                        .font(.title3)
                        .fontWeight(.bold)
                    Text("Workouts")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                VStack(alignment: .leading) {
                    Text(formatDistance(workoutViewModel.totalDistance(for: period, type: type), type: type))
                        .font(.title3)
                        .fontWeight(.bold)
                    Text("Distance")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
        .padding(.horizontal)
    }
    
    private func colorForType(_ type: WorkoutType) -> Color {
        switch type {
        case .run: return .red
        case .bike: return .blue
        case .swim: return .cyan
        }
    }
    
    private func formatDistance(_ distance: Double, type: WorkoutType) -> String {
        switch type {
        case .run, .bike:
            return String(format: "%.2f km", distance)
        case .swim:
            return String(format: "%.0f m", distance * 1000)
        }
    }
}

#Preview {
    AnalyticsView()
        .environmentObject(WorkoutViewModel(context: PersistenceController.preview.container.viewContext))
}

