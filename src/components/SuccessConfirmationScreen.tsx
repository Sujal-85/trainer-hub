import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface SuccessConfirmationScreenProps {
  trainerType: 'non-technical' | 'technical';
  onReset: () => void;
}

const SuccessConfirmationScreen = ({ trainerType, onReset }: SuccessConfirmationScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const confettiColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: confettiColors[i % confettiColors.length],
                left: `${Math.random() * 100}%`,
                top: -20,
              }}
              initial={{ y: 0, rotate: 0, opacity: 1 }}
              animate={{
                y: window.innerHeight + 100,
                rotate: Math.random() * 720 - 360,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'var(--gradient-accent)' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        className="relative z-10 max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          className="relative mx-auto w-32 h-32 mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
        >
          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-success/20"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-success/20"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          
          {/* Icon container */}
          <div className="relative w-full h-full rounded-full bg-success/10 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 text-success" />
            </motion.div>
          </div>

          {/* Sparkles */}
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welcome Aboard! 🎉
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Your {trainerType === 'technical' ? 'Technical' : 'Non-Technical'} Trainer profile has been created successfully.
          </p>
          <p className="text-muted-foreground mb-8">
            Our team will review your application and get back to you within 24-48 hours.
          </p>
        </motion.div>

        {/* Next Steps Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-card rounded-2xl p-6 mb-8 text-left"
        >
          <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
          <ul className="space-y-3">
            {[
              'Profile review by our team',
              'Email confirmation with login details',
              'Access to your trainer dashboard',
              'Start receiving training opportunities',
            ].map((step, index) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center gap-3 text-muted-foreground"
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                {step}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onReset}
          className="btn-primary inline-flex items-center gap-2"
        >
          Register Another Trainer
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SuccessConfirmationScreen;
