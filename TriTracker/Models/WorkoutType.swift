import Foundation

enum WorkoutType: String, CaseIterable, Identifiable {
    case run = "Run"
    case bike = "Bike"
    case swim = "Swim"
    
    var id: String { rawValue }
    
    var icon: String {
        switch self {
        case .run: return "figure.run"
        case .bike: return "bicycle"
        case .swim: return "figure.pool.swim"
        }
    }
}

