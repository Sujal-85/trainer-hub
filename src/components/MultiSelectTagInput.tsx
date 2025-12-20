import { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus } from 'lucide-react';
import { TECHNICAL_SKILLS } from '@/types/trainer';

interface MultiSelectTagInputProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  label: string;
}

const MultiSelectTagInput = ({ selectedTags, onTagsChange, label }: MultiSelectTagInputProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allSkills = TECHNICAL_SKILLS.flatMap(category => 
    category.skills.map(skill => ({ skill, category: category.category }))
  );

  const filteredSkills = allSkills.filter(
    ({ skill }) => 
      skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedTags.includes(skill)
  );

  const groupedFilteredSkills = TECHNICAL_SKILLS.map(category => ({
    ...category,
    skills: category.skills.filter(
      skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedTags.includes(skill)
    )
  })).filter(category => category.skills.length > 0);

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      const matchingSkill = allSkills.find(
        ({ skill }) => skill.toLowerCase() === searchQuery.toLowerCase()
      );
      if (matchingSkill) {
        handleAddTag(matchingSkill.skill);
      } else if (searchQuery.trim().length >= 2) {
        handleAddTag(searchQuery.trim());
      }
    } else if (e.key === 'Backspace' && !searchQuery && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <AnimatePresence>
          {selectedTags.map(tag => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search or type to add skills..."
          className="input-field pl-12"
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (searchQuery || filteredSkills.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full max-w-2xl max-h-64 overflow-y-auto rounded-xl border border-border bg-card shadow-xl"
          >
            {groupedFilteredSkills.map(category => (
              <div key={category.category}>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/50">
                  {category.category}
                </div>
                <div className="p-2 flex flex-wrap gap-2">
                  {category.skills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddTag(skill)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {searchQuery && !allSkills.find(s => s.skill.toLowerCase() === searchQuery.toLowerCase()) && (
              <button
                type="button"
                onClick={() => handleAddTag(searchQuery)}
                className="w-full px-4 py-3 flex items-center gap-2 text-left hover:bg-secondary transition-colors border-t border-border"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>Add "<strong>{searchQuery}</strong>" as custom skill</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiSelectTagInput;
