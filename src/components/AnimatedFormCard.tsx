import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedFormCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  direction?: 'forward' | 'backward';
}

const AnimatedFormCard = ({
  children,
  title,
  subtitle,
  currentStep,
  direction = 'forward',
}: AnimatedFormCardProps) => {
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'forward' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'forward' ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      key={currentStep}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full"
    >
      <div className="glass-card rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Header */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1 md:mb-2 leading-tight"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm md:text-base text-muted-foreground leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedFormCard;
