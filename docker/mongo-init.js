// ============================================
// MongoDB Initialization Script
// AI Healthcare Avatar Platform
// ============================================

// Initialize avatar database
db = db.getSiblingDB('avatar_db');

// Create collections if they don't exist
db.createCollection('users');
db.createCollection('chats');

// Create indexes for performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.chats.createIndex({ "userId": 1 });
db.chats.createIndex({ "updatedAt": -1 });

// Sample healthcare personas metadata
// (Actual personas are in backend/services/ollamaService.js)
const personasMetadata = [
    {
        id: "cardiologist",
        name: "Dr. Sarah Chen",
        specialty: "Cardiology",
        avatar: "👩‍⚕️",
        description: "Experienced cardiologist focused on evidence-based care"
    },
    {
        id: "oncologist",
        name: "Dr. Michael Torres",
        specialty: "Oncology",
        avatar: "👨‍⚕️",
        description: "Oncologist prioritizing patient outcomes and quality of life"
    },
    {
        id: "neurologist",
        name: "Dr. Emily Watson",
        specialty: "Neurology",
        avatar: "👩‍⚕️",
        description: "Detail-oriented neurologist specializing in CNS therapies"
    },
    {
        id: "pediatrician",
        name: "Dr. James Park",
        specialty: "Pediatrics",
        avatar: "👨‍⚕️",
        description: "Cautious pediatrician prioritizing child safety"
    }
];

// Create or update personas collection
db.createCollection('personas');
db.personas.createIndex({ "id": 1 }, { unique: true });

// Insert personas if they don't exist
personasMetadata.forEach(persona => {
    db.personas.updateOne(
        { id: persona.id },
        { $setOnInsert: persona },
        { upsert: true }
    );
});

print('Database initialized successfully!');
print('Collections created: users, chats, personas');
print('Indexes created for performance optimization');
