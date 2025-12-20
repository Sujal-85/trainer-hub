import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SelectableCardProps {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  selected: boolean;
  onSelect: (id: string) => void;
  variant?: 'default' | 'compact';
}

const SelectableCard = ({
  id,
  label,
  description,
  icon,
  selected,
  onSelect,
  variant = 'default',
}: SelectableCardProps) => {
  return (
    <motion.div
      className={`selectable-card ${selected ? 'selected' : ''} ${variant === 'compact' ? 'p-3' : ''}`}
      onClick={() => onSelect(id)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Selection indicator */}
      <motion.div
        className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
          selected ? 'bg-primary text-primary-foreground' : 'border-2 border-border'
        }`}
        animate={{ scale: selected ? 1 : 0.9 }}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className="w-4 h-4" />
          </motion.div>
        )}
      </motion.div>

      <div className="flex flex-col gap-1 pr-8">
        {icon && (
          <span className="text-2xl mb-1" role="img" aria-label={label}>
            {icon}
          </span>
        )}
        <span className="font-semibold text-foreground">{label}</span>
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </div>

      {/* Ripple effect */}
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default SelectableCard;
