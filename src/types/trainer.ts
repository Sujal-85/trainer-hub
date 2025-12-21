export type TrainerType = 'non-technical' | 'technical' | null;

export interface NonTechnicalFormData {
  // Step 1: Basic Info
  fullName: string;
  whatsappNumber: string;
  email: string;
  city: string;
  state: string;

  // Step 2: Training Areas
  trainingAreas: string[];

  // Step 3: Experience & Travel
  experienceLevel: string;
  travelWillingness: string;

  // Step 4: Language & Availability
  languages: string[];
  availability: string;
  trainingMode: string;

  // Step 5: Fees & Documents
  dailyFee: string;
  resume: File | null;
  profilePhoto: File | null;

  // Step 6: Final Details
  shortBio: string;
  demoSessionLink: string;
  programConsent: string;
}

export interface TechnicalFormData {
  // Step 1: Personal Details
  fullName: string;
  whatsappNumber: string;
  email: string;
  city: string;
  state: string;
  travelWillingness: string;
  feedbackScore: number;

  // Step 2: Technical Skills
  technicalSkills: string[];

  // Step 3: Domain Expertise
  domainExpertise: string[];

  // Step 4: Experience
  trainingExperience: string;
  hasIndustryExperience: boolean;
  industryDetails: string;

  // Step 5: Languages, Fees, Availability
  languages: string[];
  dailyFee: string;
  availability: string;

  // Step 6: Documents & Consent
  resume: File | null;
  profilePhoto: File | null;
  demoSessionLinks: string;
  shortBio: string;
  subscriptionConsent: boolean;
}

export const TRAINING_AREAS = [
  { id: 'communication', label: 'Communication Skills', icon: '💬' },
  { id: 'soft-skills', label: 'Soft Skills', icon: '🤝' },
  { id: 'aptitude', label: 'Aptitude', icon: '🧮' },
  { id: 'logical-reasoning', label: 'Logical Reasoning', icon: '🧩' },
  { id: 'personality', label: 'Personality Development', icon: '✨' },
  { id: 'career', label: 'Career Guidance', icon: '🎯' },
  { id: 'corporate', label: 'Corporate Training', icon: '🏢' },
];

export const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: '0–1 year', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', description: '1–3 years', icon: '📈' },
  { id: 'advanced', label: 'Advanced', description: '3–5 years', icon: '⭐' },
  { id: 'expert', label: 'Expert', description: '5+ years', icon: '🏆' },
];

export const TRAVEL_OPTIONS = [
  { id: 'within-city', label: 'Within City', icon: '🏙️' },
  { id: 'up-to-50km', label: 'Up to 50 km', icon: '🚗' },
  { id: 'up-to-100km', label: 'Up to 100 km', icon: '🚄' },
  { id: 'online-only', label: 'Only Online', icon: '💻' },
];

export const LANGUAGES = [
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'marathi', label: 'Marathi' },
  { id: 'gujarati', label: 'Gujarati' },
  { id: 'tamil', label: 'Tamil' },
  { id: 'telugu', label: 'Telugu' },
  { id: 'kannada', label: 'Kannada' },
  { id: 'bengali', label: 'Bengali' },
  { id: 'punjabi', label: 'Punjabi' },
  { id: 'malayalam', label: 'Malayalam' },
  { id: 'french', label: 'French' },
  { id: 'german', label: 'German' },
  { id: 'spanish', label: 'Spanish' },
  { id: 'other', label: 'Other' },
];

export const AVAILABILITY_OPTIONS = [
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekends', label: 'Weekends' },
  { id: 'both', label: 'Both' },
];

export const TRAINING_MODES = [
  { id: 'online', label: 'Online', icon: '🌐' },
  { id: 'offline', label: 'Offline', icon: '🏛️' },
  { id: 'hybrid', label: 'Hybrid', icon: '🔄' },
];

export const CONSENT_OPTIONS = [
  { id: 'yes', label: 'Yes, I agree' },
  { id: 'no', label: 'No, not now' },
  { id: 'details', label: 'Need more details' },
];

export const TECHNICAL_SKILLS = [
  { category: 'Programming & Software', skills: ['Python', 'C++', 'Java', 'JavaScript', 'React', 'Node.js', 'Angular', 'Vue.js', 'TypeScript', 'Go', 'Rust'] },
  { category: 'Cloud & Security', skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Cybersecurity', 'DevOps', 'CI/CD'] },
  { category: 'Data & AI', skills: ['Machine Learning', 'Deep Learning', 'Data Science', 'Python for Data', 'TensorFlow', 'PyTorch', 'MongoDB', 'Power BI', 'Tableau', 'SQL'] },
  { category: 'Engineering Tools', skills: ['SolidWorks', 'CATIA', 'AutoCAD', 'MATLAB', 'Primavera', 'IoT', 'Drone Technology', 'Embedded Systems', 'Arduino', 'Raspberry Pi'] },
];

export const ENGINEERING_DOMAINS = [
  { id: 'computer-science', label: 'Computer Science Engineering', icon: '💻' },
  { id: 'electronics', label: 'Electronics & Telecommunication', icon: '📡' },
  { id: 'civil', label: 'Civil Engineering', icon: '🏗️' },
  { id: 'automobile', label: 'Automobile Engineering', icon: '🚗' },
  { id: 'biomedical', label: 'Biomedical Engineering', icon: '🧬' },
  { id: 'metallurgy', label: 'Metallurgy', icon: '⚙️' },
];

export const TRAINING_EXPERIENCE_OPTIONS = [
  { id: '0-1', label: '0–1 years' },
  { id: '1-3', label: '1–3 years' },
  { id: '3-5', label: '3–5 years' },
  { id: '5-10', label: '5–10 years' },
  { id: '10+', label: '10+ years' },
];
