import Foundation
import CoreData
import SwiftUI

class WorkoutViewModel: ObservableObject {
    @Published var workouts: [Workout] = []
    private let viewContext: NSManagedObjectContext
    
    init(context: NSManagedObjectContext) {
        self.viewContext = context
        fetchWorkouts()
    }
    
    func fetchWorkouts() {
        let request: NSFetchRequest<Workout> = Workout.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \Workout.date, ascending: false)]
        
        do {
            workouts = try viewContext.fetch(request)
        } catch {
            print("Error fetching workouts: \(error)")
        }
    }
    
    func addWorkout(
        type: WorkoutType,
        date: Date,
        duration: TimeInterval,
        distance: Double,
        calories: Int32,
        averageHeartRate: Int32,
        averageWattage: Int32
    ) {
        let workout = Workout(context: viewContext)
        workout.id = UUID()
        workout.type = type.rawValue
        workout.date = date
        workout.duration = duration
        workout.distance = distance
        workout.calories = calories
        workout.averageHeartRate = averageHeartRate
        workout.averageWattage = averageWattage
        
        saveContext()
    }
    
    func deleteWorkout(_ workout: Workout) {
        viewContext.delete(workout)
        saveContext()
    }
    
    private func saveContext() {
        do {
            try viewContext.save()
            fetchWorkouts()
        } catch {
            print("Error saving context: \(error)")
        }
    }
    
    // Analytics functions
    func workoutsForPeriod(_ period: AnalyticsPeriod, type: WorkoutType? = nil) -> [Workout] {
        let calendar = Calendar.current
        let now = Date()
        let startDate: Date
        
        switch period {
        case .daily:
            startDate = calendar.startOfDay(for: now)
        case .weekly:
            startDate = calendar.date(byAdding: .day, value: -7, to: now) ?? now
        case .monthly:
            startDate = calendar.date(byAdding: .month, value: -1, to: now) ?? now
        case .yearly:
            startDate = calendar.date(byAdding: .year, value: -1, to: now) ?? now
        }
        
        return workouts.filter { workout in
            guard let workoutDate = workout.date, workoutDate >= startDate else { return false }
            if let type = type {
                return workout.workoutType == type
            }
            return true
        }
    }
    
    func totalDistance(for period: AnalyticsPeriod, type: WorkoutType? = nil) -> Double {
        workoutsForPeriod(period, type: type).reduce(0) { $0 + $1.distance }
    }
    
    func totalDuration(for period: AnalyticsPeriod, type: WorkoutType? = nil) -> TimeInterval {
        workoutsForPeriod(period, type: type).reduce(0) { $0 + $1.duration }
    }
    
    func totalCalories(for period: AnalyticsPeriod, type: WorkoutType? = nil) -> Int32 {
        workoutsForPeriod(period, type: type).reduce(0) { $0 + $1.calories }
    }
    
    func averageHeartRate(for period: AnalyticsPeriod, type: WorkoutType? = nil) -> Double {
        let workouts = workoutsForPeriod(period, type: type)
        guard !workouts.isEmpty else { return 0 }
        let sum = workouts.reduce(0) { $0 + Double($1.averageHeartRate) }
        return sum / Double(workouts.count)
    }
    
    func averageWattage(for period: AnalyticsPeriod, type: WorkoutType? = nil) -> Double {
        let workouts = workoutsForPeriod(period, type: type)
        guard !workouts.isEmpty else { return 0 }
        let filtered = workouts.filter { $0.averageWattage > 0 }
        guard !filtered.isEmpty else { return 0 }
        let sum = filtered.reduce(0) { $0 + Double($1.averageWattage) }
        return sum / Double(filtered.count)
    }
    
    func workoutCount(for period: AnalyticsPeriod, type: WorkoutType? = nil) -> Int {
        workoutsForPeriod(period, type: type).count
    }
}

enum AnalyticsPeriod: String, CaseIterable {
    case daily = "Daily"
    case weekly = "Weekly"
    case monthly = "Monthly"
    case yearly = "Yearly"
}

