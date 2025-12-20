import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TrainerTypeSelector from '@/components/TrainerTypeSelector';
import NonTechnicalForm from '@/components/NonTechnicalForm';
import TechnicalForm from '@/components/TechnicalForm';
import SuccessConfirmationScreen from '@/components/SuccessConfirmationScreen';
import { TrainerType } from '@/types/trainer';
import { Helmet } from 'react-helmet-async';

type AppState = 'selection' | 'non-technical-form' | 'technical-form' | 'success';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('selection');
  const [completedTrainerType, setCompletedTrainerType] = useState<'non-technical' | 'technical'>('non-technical');

  const handleTrainerTypeSelect = (type: TrainerType) => {
    if (type === 'non-technical') {
      setAppState('non-technical-form');
    } else if (type === 'technical') {
      setAppState('technical-form');
    }
  };

  const handleBackToSelection = () => {
    setAppState('selection');
  };

  const handleFormComplete = (type: 'non-technical' | 'technical') => {
    setCompletedTrainerType(type);
    setAppState('success');
  };

  const handleReset = () => {
    setAppState('selection');
  };

  return (
    <>
      <Helmet>
        <title>Become a Trainer | Professional Training Registration Platform</title>
        <meta name="description" content="Join our network of professional trainers. Register as a technical or non-technical trainer and start your training career today." />
        <meta name="keywords" content="trainer registration, corporate training, technical training, soft skills, career guidance" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          {appState === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TrainerTypeSelector onSelect={handleTrainerTypeSelect} />
            </motion.div>
          )}

          {appState === 'non-technical-form' && (
            <motion.div
              key="non-technical-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <NonTechnicalForm
                onBack={handleBackToSelection}
                onComplete={() => handleFormComplete('non-technical')}
              />
            </motion.div>
          )}

          {appState === 'technical-form' && (
            <motion.div
              key="technical-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TechnicalForm
                onBack={handleBackToSelection}
                onComplete={() => handleFormComplete('technical')}
              />
            </motion.div>
          )}

          {appState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SuccessConfirmationScreen
                trainerType={completedTrainerType}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Index;
