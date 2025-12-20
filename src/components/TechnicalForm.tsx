import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, User, Phone, Mail, MapPin, Building, Loader2, Sparkles } from 'lucide-react';
import StepperProgressBar from './StepperProgressBar';
import AnimatedFormCard from './AnimatedFormCard';
import InputFieldWithIcon from './InputFieldWithIcon';
import SelectableCard from './SelectableCard';
import DragDropFileUploader from './DragDropFileUploader';
import MultiSelectTagInput from './MultiSelectTagInput';
import { registerTrainer, parseResume } from '@/lib/api';
import { toast } from 'sonner';
import {
  TechnicalFormData,
  TRAVEL_OPTIONS,
  LANGUAGES,
  AVAILABILITY_OPTIONS,
  ENGINEERING_DOMAINS,
  TRAINING_EXPERIENCE_OPTIONS,
} from '@/types/trainer';

interface TechnicalFormProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEP_LABELS = ['Personal', 'Skills', 'Domain', 'Experience', 'Details', 'Submit'];

const initialFormData: TechnicalFormData = {
  fullName: '',
  whatsappNumber: '',
  email: '',
  city: '',
  state: '',
  travelWillingness: '',
  feedbackScore: 7,
  technicalSkills: [],
  domainExpertise: [],
  trainingExperience: '',
  hasIndustryExperience: false,
  industryDetails: '',
  languages: [],
  dailyFee: '',
  availability: '',
  resume: null,
  profilePhoto: null,
  demoSessionLinks: '',
  shortBio: '',
  subscriptionConsent: false,
};

const TechnicalForm = ({ onBack, onComplete }: TechnicalFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState<TechnicalFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof TechnicalFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const totalSteps = 6;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone.replace(/\D/g, ''));

  const validateField = (field: keyof TechnicalFormData, value: any): string => {
    switch (field) {
      case 'email':
        return value && !validateEmail(value) ? 'Invalid email format' : '';
      case 'whatsappNumber':
        return value && !validatePhone(value) ? 'Invalid phone number (10 digits required)' : '';
      case 'fullName':
        return !value ? 'Full name is required' : '';
      case 'city':
        return !value ? 'City is required' : '';
      case 'state':
        return !value ? 'State is required' : '';
      case 'dailyFee':
        return !value ? 'Daily fee is required' : '';
      case 'shortBio':
        return !value ? 'Short bio is required' : '';
      default:
        return '';
    }
  };

  const updateField = useCallback(<K extends keyof TechnicalFormData>(
    field: K,
    value: TechnicalFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const toggleArrayField = useCallback((field: 'domainExpertise' | 'languages', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  }, []);

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setDirection('forward');
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        await registerTrainer('technical', formData, {
          resume: formData.resume || undefined,
          profilePhoto: formData.profilePhoto || undefined,
        });
        toast.success('Profile created successfully!');
        onComplete();
      } catch (error: any) {
        toast.error(error.message || 'Something went wrong');
      } finally {
        setIsSubmitting(false);
      }
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

  const handleAiParse = async (file: File) => {
    setIsParsing(true);
    try {
      const response = await parseResume(file);
      const extracted = response.data;

      setFormData(prev => ({
        ...prev,
        ...extracted,
        resume: file // Keep the file too
      }));
      toast.success('Form auto-filled successfully!');
    } catch (error: any) {
      toast.error('AI could not parse this file. Please fill manually.');
      console.error(error);
    } finally {
      setIsParsing(false);
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.fullName &&
          formData.whatsappNumber &&
          formData.email &&
          formData.city &&
          formData.state &&
          formData.travelWillingness &&
          !errors.email &&
          !errors.whatsappNumber
        );
      case 2:
        return formData.technicalSkills.length > 0;
      case 3:
        return formData.domainExpertise.length > 0;
      case 4:
        return !!(formData.trainingExperience && (!formData.hasIndustryExperience || formData.industryDetails));
      case 5:
        return !!(formData.languages.length > 0 && formData.dailyFee && formData.availability);
      case 6:
        return !!(formData.resume && formData.shortBio);
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AnimatedFormCard
            title="Personal & Contact Details"
            subtitle="Let's set up your professional profile."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Magic Auto-fill</h4>
                    <p className="text-xs text-muted-foreground">Upload your resume to fill the form instantly</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="ai-resume-upload-tech"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAiParse(file);
                  }}
                />
                <label
                  htmlFor="ai-resume-upload-tech"
                  className={`flex items-center justify-center w-full py-3 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all cursor-pointer ${isParsing ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {isParsing ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <span className="text-sm font-medium text-primary">Upload Resume (PDF)</span>
                  )}
                </label>
              </div>

              <InputFieldWithIcon
                icon={User}
                label="Full Name"
                placeholder="e.g., Rajesh Kumar"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                error={errors.fullName}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputFieldWithIcon
                  icon={Phone}
                  label="WhatsApp Number"
                  placeholder="e.g., 9876543210"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => updateField('whatsappNumber', e.target.value)}
                  error={errors.whatsappNumber}
                />
                <InputFieldWithIcon
                  icon={Mail}
                  label="Email Address"
                  placeholder="e.g., rajesh@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={errors.email}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputFieldWithIcon
                  icon={MapPin}
                  label="City"
                  placeholder="e.g., Bangalore"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  error={errors.city}
                />
                <InputFieldWithIcon
                  icon={Building}
                  label="State"
                  placeholder="e.g., Karnataka"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  error={errors.state}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Willingness to Travel
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TRAVEL_OPTIONS.map((option) => (
                    <SelectableCard
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      icon={option.icon}
                      selected={formData.travelWillingness === option.id}
                      onSelect={(id) => updateField('travelWillingness', id)}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Average Feedback Score (1-10)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.feedbackScore}
                    onChange={(e) => updateField('feedbackScore', Number(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <span className="text-2xl font-bold text-primary min-w-[3rem] text-center">
                    {formData.feedbackScore}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedFormCard>
        );

      case 2:
        return (
          <AnimatedFormCard
            title="Technical Skills & Tools"
            subtitle="Search and select your technical expertise. You can add custom skills too."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="relative">
              <MultiSelectTagInput
                selectedTags={formData.technicalSkills}
                onTagsChange={(tags) => updateField('technicalSkills', tags)}
                label="Your Technical Skills"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                💡 Tip: Type to search or add custom skills. Press Enter to add.
              </p>
            </div>
          </AnimatedFormCard>
        );

      case 3:
        return (
          <AnimatedFormCard
            title="Domain Expertise"
            subtitle="Select the engineering domains you specialize in."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ENGINEERING_DOMAINS.map((domain) => (
                <SelectableCard
                  key={domain.id}
                  id={domain.id}
                  label={domain.label}
                  icon={domain.icon}
                  selected={formData.domainExpertise.includes(domain.id)}
                  onSelect={() => toggleArrayField('domainExpertise', domain.id)}
                />
              ))}
            </div>
          </AnimatedFormCard>
        );

      case 4:
        return (
          <AnimatedFormCard
            title="Experience Details"
            subtitle="Share your training and industry background."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Total Training Experience
                </label>
                <div className="flex flex-wrap gap-3">
                  {TRAINING_EXPERIENCE_OPTIONS.map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => updateField('trainingExperience', option.id)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${formData.trainingExperience === option.id
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
                  Do you have Industry Experience?
                </label>
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    onClick={() => updateField('hasIndustryExperience', true)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${formData.hasIndustryExperience
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Yes
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => {
                      updateField('hasIndustryExperience', false);
                      updateField('industryDetails', '');
                    }}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${!formData.hasIndustryExperience
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    No
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {formData.hasIndustryExperience && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tell us about your industry experience
                    </label>
                    <textarea
                      placeholder="Companies, roles, duration, key projects..."
                      value={formData.industryDetails}
                      onChange={(e) => updateField('industryDetails', e.target.value)}
                      rows={4}
                      className="input-field resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedFormCard>
        );

      case 5:
        return (
          <AnimatedFormCard
            title="Languages, Fees & Availability"
            subtitle="Set your preferences for training engagements."
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
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${formData.languages.includes(lang.id)
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
                <label className="block text-sm font-medium text-foreground mb-2">
                  Daily Training Fee (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input
                    type="number"
                    placeholder="e.g., 8000"
                    value={formData.dailyFee}
                    onChange={(e) => updateField('dailyFee', e.target.value)}
                    className="input-field pl-10"
                  />
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
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${formData.availability === option.id
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

      case 6:
        return (
          <AnimatedFormCard
            title="Documents & Final Consent"
            subtitle="Upload your documents and confirm your participation."
            currentStep={currentStep}
            direction={direction}
          >
            <div className="space-y-6">
              <DragDropFileUploader
                label="Resume / CV (Required)"
                accept=".pdf"
                type="document"
                selectedFile={formData.resume}
                onFileSelect={(file) => updateField('resume', file)}
                helperText="PDF format. Max 5MB."
              />

              <DragDropFileUploader
                label="Profile Photo"
                accept="image/*"
                type="image"
                selectedFile={formData.profilePhoto}
                onFileSelect={(file) => updateField('profilePhoto', file)}
                helperText="A professional headshot works best."
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Demo Session Links (Optional)
                </label>
                <input
                  type="text"
                  placeholder="YouTube, Vimeo, or other video links..."
                  value={formData.demoSessionLinks}
                  onChange={(e) => updateField('demoSessionLinks', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Short Technical Bio
                </label>
                <textarea
                  placeholder="Highlight your technical expertise, certifications, notable projects..."
                  value={formData.shortBio}
                  onChange={(e) => updateField('shortBio', e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-start gap-3">
                  <motion.button
                    type="button"
                    onClick={() => updateField('subscriptionConsent', !formData.subscriptionConsent)}
                    className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center transition-all ${formData.subscriptionConsent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border-2 border-border'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {formData.subscriptionConsent && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </motion.button>
                  <div>
                    <p className="font-medium text-foreground">
                      Subscription Plan Agreement
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      I agree to the subscription plan of ₹1,000/month after completing 5 successful training sessions.
                    </p>
                  </div>
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
            <span className="text-sm text-muted-foreground">Technical Trainer</span>
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
            disabled={!isStepValid() || isSubmitting}
            className="btn-primary flex items-center min-w-[140px] justify-center"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {currentStep === totalSteps ? 'Create My Trainer Profile' : 'Next'}
                {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalForm;
