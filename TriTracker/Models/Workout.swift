import Foundation
import CoreData

extension Workout {
    var workoutType: WorkoutType? {
        get {
            guard let typeString = type else { return nil }
            return WorkoutType(rawValue: typeString)
        }
        set {
            type = newValue?.rawValue
        }
    }
    
    var dateValue: Date {
        get { date ?? Date() }
        set { date = newValue }
    }
    
    var durationInSeconds: TimeInterval {
        get { duration }
        set { duration = newValue }
    }
    
    var formattedDuration: String {
        let hours = Int(duration) / 3600
        let minutes = (Int(duration) % 3600) / 60
        let seconds = Int(duration) % 60
        
        if hours > 0 {
            return String(format: "%d:%02d:%02d", hours, minutes, seconds)
        } else {
            return String(format: "%d:%02d", minutes, seconds)
        }
    }
    
    var formattedDistance: String {
        guard let workoutType = workoutType else { return "0" }
        let distanceValue = distance
        
        switch workoutType {
        case .run:
            return String(format: "%.2f km", distanceValue)
        case .bike:
            return String(format: "%.2f km", distanceValue)
        case .swim:
            return String(format: "%.2f m", distanceValue * 1000)
        }
    }
}





