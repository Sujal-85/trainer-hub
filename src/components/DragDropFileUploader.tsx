import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, Check, X } from 'lucide-react';

interface DragDropFileUploaderProps {
  label: string;
  accept: string;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  type: 'document' | 'image';
  helperText?: string;
}

const DragDropFileUploader = ({
  label,
  accept,
  onFileSelect,
  selectedFile,
  type,
  helperText,
}: DragDropFileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const Icon = type === 'document' ? FileText : Image;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      
      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative p-4 rounded-xl border-2 border-success bg-success/5"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.1 }}
                className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-success" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`relative p-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-3 text-center">
              <motion.div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isDragOver ? 'bg-primary/20' : 'bg-secondary'
                }`}
                animate={{ scale: isDragOver ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className={`w-6 h-6 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
              </motion.div>
              
              <div>
                <p className="font-medium text-foreground">
                  {isDragOver ? 'Drop your file here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {type === 'document' ? 'PDF files only' : 'JPG, PNG or WebP'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {helperText && (
        <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default DragDropFileUploader;
