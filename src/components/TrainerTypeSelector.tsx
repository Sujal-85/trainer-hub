import { motion } from 'framer-motion';
import { GraduationCap, Code, ArrowRight } from 'lucide-react';
import { TrainerType } from '@/types/trainer';

interface TrainerTypeSelectorProps {
  onSelect: (type: TrainerType) => void;
}

const TrainerTypeSelector = ({ onSelect }: TrainerTypeSelectorProps) => {
  const trainerTypes = [
    {
      type: 'non-technical' as const,
      icon: GraduationCap,
      emoji: '🎓',
      title: 'Non-Technical Trainer',
      description: 'Soft skills, communication, aptitude, personality development, career guidance, corporate training',
      cta: 'Register as Non-Technical Trainer',
      color: 'text-emerald-600',
      bgGlow: 'bg-emerald-50',
    },
    {
      type: 'technical' as const,
      icon: Code,
      emoji: '💻',
      title: 'Technical Trainer',
      description: 'Programming, engineering domains, software tools, industry & training experience',
      cta: 'Register as Technical Trainer',
      color: 'text-indigo-600',
      bgGlow: 'bg-indigo-50',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background/50">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary mb-6"
          >
            Join Our Training Network
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-3 md:mb-4 tracking-tight"
          >
            Become a <span className="text-primary">Trainer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Choose your category to begin your registration journey
          </motion.p>
        </motion.div>

        {/* Trainer Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {trainerTypes.map((trainer, index) => (
            <motion.div
              key={trainer.type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <motion.button
                onClick={() => onSelect(trainer.type)}
                className="w-full text-left group relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {/* Card */}
                <div className="relative glass-card rounded-3xl p-8 md:p-10 h-full">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 ${trainer.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <motion.span
                        className="text-4xl sm:text-5xl md:text-6xl block"
                        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        {trainer.emoji}
                      </motion.span>
                    </div>

                    {/* Title */}
                    <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:${trainer.color} transition-colors`}>
                      {trainer.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed line-clamp-2 md:line-clamp-none">
                      {trainer.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 font-semibold text-primary">
                      <span>{trainer.cta}</span>
                      <motion.div
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>

                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          Not sure which category fits you?{' '}
          <span className="text-primary cursor-pointer hover:underline">
            Contact our support team
          </span>
        </motion.p>
      </div>
    </div>
  );
};

export default TrainerTypeSelector;
