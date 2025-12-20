import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepperProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const StepperProgressBar = ({ currentStep, totalSteps, stepLabels }: StepperProgressBarProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0" />
        
        {/* Progress line filled */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-primary z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="relative z-10 flex flex-col items-center">
              <motion.div
                className={`step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  stepNumber
                )}
              </motion.div>
              
              {stepLabels && stepLabels[index] && (
                <span className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                  isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {stepLabels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperProgressBar;
