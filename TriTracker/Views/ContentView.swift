import SwiftUI

struct ContentView: View {
    @Environment(\.managedObjectContext) private var viewContext
    @StateObject private var workoutViewModel: WorkoutViewModel
    
    init() {
        let context = PersistenceController.shared.container.viewContext
        _workoutViewModel = StateObject(wrappedValue: WorkoutViewModel(context: context))
    }
    
    var body: some View {
        TabView {
            WorkoutListView()
                .tabItem {
                    Label("Workouts", systemImage: "list.bullet")
                }
            
            AnalyticsView()
                .tabItem {
                    Label("Analytics", systemImage: "chart.bar.fill")
                }
        }
        .environmentObject(workoutViewModel)
    }
}

#Preview {
    ContentView()
        .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}

