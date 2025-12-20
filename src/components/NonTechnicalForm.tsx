import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, User, Phone, Mail, MapPin, Building } from 'lucide-react';
import StepperProgressBar from './StepperProgressBar';
import AnimatedFormCard from './AnimatedFormCard';
import InputFieldWithIcon from './InputFieldWithIcon';
import SelectableCard from './SelectableCard';
import DragDropFileUploader from './DragDropFileUploader';
import {
  NonTechnicalFormData,
  TRAINING_AREAS,
  EXPERIENCE_LEVELS,
  TRAVEL_OPTIONS,
  LANGUAGES,
  AVAILABILITY_OPTIONS,
  TRAINING_MODES,
  CONSENT_OPTIONS,
} from '@/types/trainer';

interface NonTechnicalFormProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEP_LABELS = ['Basic Info', 'Training', 'Experience', 'Languages', 'Documents', 'Final'];

const initialFormData: NonTechnicalFormData = {
  fullName: '',
  whatsappNumber: '',
  email: '',
  city: '',
  state: '',
  trainingAreas: [],
  experienceLevel: '',
  travelWillingness: '',
  languages: [],
  availability: '',
  trainingMode: '',
  dailyFee: '',
  resume: null,
  profilePhoto: null,
  shortBio: '',
  demoSessionLink: '',
  programConsent: '',
};

const NonTechnicalForm = ({ onBack, onComplete }: NonTechnicalFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState<NonTechnicalFormData>(initialFormData);

  const totalSteps = 6;

  const updateField = useCallback(<K extends keyof NonTechnicalFormData>(
    field: K,
    value: NonTechnicalFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleArrayField = useCallback((field: 'trainingAreas' | 'languages', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setDirection('forward');
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection('backward');
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.fullName && formData.whatsappNumber && formData.email && formData.city && formData.state);
      case 2:
        return formData.trainingAreas.length > 0;
      case 3:
        return !!(formData.experienceLevel && formData.travelWillingness);
      case 4:
        return !!(formData.languages.length > 0 && formData.availability && formData.trainingMode);
      case 5:
        return !!(formData.dailyFee);
      case 6:
        return !!(formData.shortBio && formData.programConsent);
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AnimatedFormCard
            title="Let's start with the basics"
            subtitle="Tell us about yourself so we can create your trainer profile."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="space-y-5">
              <InputFieldWithIcon
                icon={User}
                label="Full Name"
                placeholder="e.g., Priya Sharma"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
              />
              <InputFieldWithIcon
                icon={Phone}
                label="WhatsApp Number"
                placeholder="e.g., +91 98765 43210"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => updateField('whatsappNumber', e.target.value)}
              />
              <InputFieldWithIcon
                icon={Mail}
                label="Email Address"
                placeholder="e.g., priya@example.com"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputFieldWithIcon
                  icon={MapPin}
                  label="City"
                  placeholder="e.g., Mumbai"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                />
                <InputFieldWithIcon
                  icon={Building}
                  label="State"
                  placeholder="e.g., Maharashtra"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                />
              </div>
            </div>
          </AnimatedFormCard>
        );

      case 2:
        return (
          <AnimatedFormCard
            title="What do you train in?"
            subtitle="Select all areas that match your expertise. You can choose multiple."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TRAINING_AREAS.map((area) => (
                <SelectableCard
                  key={area.id}
                  id={area.id}
                  label={area.label}
                  icon={area.icon}
                  selected={formData.trainingAreas.includes(area.id)}
                  onSelect={() => toggleArrayField('trainingAreas', area.id)}
                />
              ))}
            </div>
          </AnimatedFormCard>
        );

      case 3:
        return (
          <AnimatedFormCard
            title="Experience & Mobility"
            subtitle="Help us understand your training journey and travel flexibility."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Your Training Experience
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectableCard
                      key={level.id}
                      id={level.id}
                      label={level.label}
                      description={level.description}
                      icon={level.icon}
                      selected={formData.experienceLevel === level.id}
                      onSelect={(id) => updateField('experienceLevel', id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Willingness to Travel
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TRAVEL_OPTIONS.map((option) => (
                    <SelectableCard
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      icon={option.icon}
                      selected={formData.travelWillingness === option.id}
                      onSelect={(id) => updateField('travelWillingness', id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </AnimatedFormCard>
        );

      case 4:
        return (
          <AnimatedFormCard
            title="Language & Availability"
            subtitle="Let us know when and how you prefer to conduct training sessions."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Languages You Train In
                </label>
                <div className="flex flex-wrap gap-3">
                  {LANGUAGES.map((lang) => (
                    <motion.button
                      key={lang.id}
                      type="button"
                      onClick={() => toggleArrayField('languages', lang.id)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        formData.languages.includes(lang.id)
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {lang.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Availability
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => updateField('availability', option.id)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        formData.availability === option.id
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Preferred Training Mode
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {TRAINING_MODES.map((mode) => (
                    <SelectableCard
                      key={mode.id}
                      id={mode.id}
                      label={mode.label}
                      icon={mode.icon}
                      selected={formData.trainingMode === mode.id}
                      onSelect={(id) => updateField('trainingMode', id)}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </div>
          </AnimatedFormCard>
        );

      case 5:
        return (
          <AnimatedFormCard
            title="Fees & Documents"
            subtitle="Set your daily rate and upload your professional documents."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Daily Training Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.dailyFee}
                    onChange={(e) => updateField('dailyFee', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  This is your expected daily fee for conducting training sessions.
                </p>
              </div>

              <DragDropFileUploader
                label="Resume / CV"
                accept=".pdf"
                type="document"
                selectedFile={formData.resume}
                onFileSelect={(file) => updateField('resume', file)}
                helperText="PDF format preferred. Max 5MB."
              />

              <DragDropFileUploader
                label="Profile Photo"
                accept="image/*"
                type="image"
                selectedFile={formData.profilePhoto}
                onFileSelect={(file) => updateField('profilePhoto', file)}
                helperText="A professional headshot works best."
              />
            </div>
          </AnimatedFormCard>
        );

      case 6:
        return (
          <AnimatedFormCard
            title="Almost there!"
            subtitle="Add a personal touch and confirm your participation."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Short Bio
                </label>
                <textarea
                  placeholder="Tell us about yourself in 2-3 lines..."
                  value={formData.shortBio}
                  onChange={(e) => updateField('shortBio', e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                />
                <p className="mt-1.5 text-sm text-muted-foreground">
                  This will be visible on your trainer profile.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Demo Session Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="e.g., https://youtube.com/watch?v=..."
                  value={formData.demoSessionLink}
                  onChange={(e) => updateField('demoSessionLink', e.target.value)}
                  className="input-field"
                />
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Share a video of your previous training session.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Would you like to join our Trainer Program?
                </label>
                <div className="flex flex-wrap gap-3">
                  {CONSENT_OPTIONS.map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => updateField('programConsent', option.id)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        formData.programConsent === option.id
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedFormCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col py-8 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto w-full mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={handleBack}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <span className="text-sm text-muted-foreground">Non-Technical Trainer</span>
            <h1 className="text-xl font-bold text-foreground">Registration</h1>
          </div>
        </motion.div>

        <StepperProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabels={STEP_LABELS}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="max-w-3xl mx-auto w-full mt-8">
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handleBack}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="btn-primary flex items-center"
          >
            {currentStep === totalSteps ? 'Create My Trainer Profile' : 'Next'}
            {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NonTechnicalForm;
