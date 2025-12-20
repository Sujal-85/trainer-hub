import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['technical', 'non-technical'],
        required: true
    },
    // Common Fields
    fullName: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    languages: [String],
    availability: String,
    dailyFee: String,
    shortBio: String,
    resumeUrl: String,
    profilePhotoUrl: String,
    demoSessionLink: String,
    travelWillingness: String,

    // Specific to Non-Technical
    trainingAreas: [String],
    experienceLevel: String,
    trainingMode: String,
    programConsent: String,

    // Specific to Technical
    feedbackScore: Number,
    technicalSkills: [String],
    domainExpertise: [String],
    trainingExperience: String,
    hasIndustryExperience: Boolean,
    industryDetails: String,
    subscriptionConsent: Boolean,

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;
