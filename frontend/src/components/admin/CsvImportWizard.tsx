import React, { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  FileCheck,
  ChevronRight,
  ArrowRight,
  Info
} from 'lucide-react';
import { Student } from '../../types';

interface CsvImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (students: Student[]) => void;
}

type WizardStep = 'upload' | 'validation' | 'processing' | 'success';

interface ValidationError {
  row: number;
  field: string;
  value: string;
  message: string;
}

export const CsvImportWizard: React.FC<CsvImportWizardProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [step, setStep] = useState<WizardStep>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [parsedData, setParsedData] = useState<Student[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validCount, setValidCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: validationErrors.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  if (!isOpen) return null;

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Simulated CSV Parser & Validator
  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      alert('Please upload a valid CSV file.');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const students: Student[] = [];
    const errors: ValidationError[] = [];
    
    // Skip header if it contains common terms
    let startIdx = 0;
    if (lines.length > 0) {
      const firstLine = lines[0].toLowerCase();
      if (firstLine.includes('name') || firstLine.includes('email') || firstLine.includes('program')) {
        startIdx = 1;
      }
    }

    lines.slice(startIdx).forEach((line, index) => {
      const rowNum = index + startIdx + 1;
      const cols = line.split(',').map(c => c.trim());
      
      if (cols.length < 2) {
        errors.push({
          row: rowNum,
          field: 'Row Structure',
          value: line,
          message: 'Insufficient columns. Row must have at least Name and Email.'
        });
        return;
      }

      const name = cols[0];
      const email = cols[1];
      const program = cols[2] || 'Software Engineering';
      const statusInput = cols[3] || 'Active';
      const status = (statusInput.toLowerCase() === 'pending' ? 'Pending' : 'Active') as 'Active' | 'Pending';

      // Simple validations
      if (!name) {
        errors.push({
          row: rowNum,
          field: 'Name',
          value: '',
          message: 'Name is required.'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        errors.push({
          row: rowNum,
          field: 'Email',
          value: '',
          message: 'Email is required.'
        });
      } else if (!emailRegex.test(email)) {
        errors.push({
          row: rowNum,
          field: 'Email',
          value: email,
          message: 'Invalid academic email address format.'
        });
      }

      // Generate GPA and Credits
      const gpa = parseFloat((3.0 + Math.random() * 1.0).toFixed(2));
      const totalCredits = 15 + Math.floor(Math.random() * 95);

      if (name && email && emailRegex.test(email)) {
        const generatedId = `STD-${2500 + Math.floor(Math.random() * 7000)}`;
        students.push({
          id: generatedId,
          name,
          email,
          program,
          status,
          gpa,
          totalCredits
        });
      }
    });

    setParsedData(students);
    setValidationErrors(errors);
    setValidCount(students.length);
    setStep('validation');
  };

  // Data Injection Process
  const handleStartInjection = () => {
    setStep('processing');
    setProgress(0);
    
    const duration = 2000; // 2 seconds simulation
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setStep('success');
        }, 300);
      }
    }, intervalTime);
  };

  const handleFinalizeImport = () => {
    onImportComplete(parsedData);
    resetWizard();
    onClose();
  };

  const resetWizard = () => {
    setStep('upload');
    setFileName('');
    setFileSize('');
    setParsedData([]);
    setValidationErrors([]);
    setValidCount(0);
    setProgress(0);
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-indigo-950/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Glassmorphic Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-white/75 backdrop-blur-2xl rounded-[32px] border border-white/80 p-6 md:p-8 w-full max-w-2xl shadow-[0_24px_50px_rgba(79,70,229,0.12)] z-10 overflow-hidden text-left"
      >
        {/* Dynamic decorative backdrop subtle gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-150/40 mb-6">
          <div className="text-left">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Big Data Workflow
            </span>
            <h3 className="font-display text-xl font-extrabold text-indigo-950 mt-1.5 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>CSV Ingestion Wizard</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-indigo-950 flex items-center justify-center transition-all cursor-pointer border border-gray-200/40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-4 mb-8 text-[11px] font-black uppercase tracking-wider text-gray-400">
          <div className={`flex items-center gap-1.5 ${step === 'upload' ? 'text-indigo-600 font-extrabold' : 'text-indigo-950/60'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${step === 'upload' ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
              {step === 'upload' ? '1' : '✓'}
            </span>
            <span>Upload</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <div className={`flex items-center gap-1.5 ${step === 'validation' ? 'text-indigo-600 font-extrabold' : step === 'upload' ? 'text-gray-400' : 'text-indigo-950/60'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${step === 'validation' ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : step === 'upload' ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
              {step === 'processing' || step === 'success' ? '✓' : '2'}
            </span>
            <span>Validate</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <div className={`flex items-center gap-1.5 ${step === 'processing' || step === 'success' ? 'text-indigo-600 font-extrabold' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${step === 'processing' ? 'bg-indigo-50 border-indigo-300 text-indigo-600' : step === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
              {step === 'success' ? '✓' : '3'}
            </span>
            <span>Ingest</span>
          </div>
        </div>

        {/* Wizard Main Content Container */}
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            /* STEP 1: DRAG & DROP ZONE */
            <motion.div
              key="step-upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/40 scale-98 shadow-[inset_0_0_20px_rgba(79,70,229,0.06)] animate-pulse'
                    : 'border-indigo-200 hover:border-indigo-400 hover:bg-white/40'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".csv,.txt"
                  className="hidden"
                />
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all mb-4 ${
                  isDragging 
                    ? 'bg-indigo-500 text-white border-indigo-600 shadow-md scale-110' 
                    : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                }`}>
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm font-extrabold text-indigo-950">Drag & Drop CSV Roster here</p>
                  <p className="text-xs text-gray-400 font-medium">Or click to browse your desktop files</p>
                </div>

                <div className="mt-6 flex gap-3 text-[10px] text-indigo-600 bg-indigo-50/60 border border-indigo-100/50 px-3.5 py-2 rounded-full font-bold">
                  <span className="font-mono">Expected Columns: Name, Email, Major, Status</span>
                </div>
              </div>

              {/* Sample Template Tip */}
              <div className="flex items-start gap-2.5 bg-indigo-50/30 p-3 rounded-2xl border border-indigo-100/20 text-xs text-indigo-900/75 leading-relaxed font-semibold">
                <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p>
                  Elevate CSV schemas support standard headers or raw, unformatted records. Missing statuses or majors default automatically to Active and Software Engineering.
                </p>
              </div>
            </motion.div>
          )}

          {step === 'validation' && (
            /* STEP 2: VALIDATION SCREEN */
            <motion.div
              key="step-validation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* File details banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/55 border border-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-indigo-950 truncate max-w-[240px]">{fileName}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{fileSize} • Validated Structure</p>
                  </div>
                </div>

                <button
                  onClick={resetWizard}
                  className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 px-3 py-2 rounded-xl transition-all cursor-pointer border border-indigo-100/30"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Another</span>
                </button>
              </div>

              {/* Big Data validation count summary cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/50 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Ready to Ingest</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-emerald-700">{validCount}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">rows valid</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/50 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider">Structural Errors</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-rose-700">{validationErrors.length}</span>
                    <span className="text-[10px] text-rose-600 font-bold">rows skipped</span>
                  </div>
                </div>
              </div>

              {/* Validation errors panel */}
              {validationErrors.length > 0 && (
                <div className="rounded-2xl border border-rose-200/60 bg-rose-50/10 overflow-hidden">
                  <div className="bg-rose-50 border-b border-rose-100 px-4 py-2 flex items-center gap-2 text-rose-700 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Schema Warning Logs</span>
                  </div>
                  
                  <div 
                    ref={scrollRef}
                    className="max-h-[140px] overflow-y-auto px-4 custom-scrollbar"
                  >
                    <div
                      style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const err = validationErrors[virtualRow.index];
                        return (
                          <div 
                            key={virtualRow.index}
                            className="absolute top-0 left-0 w-full flex items-center justify-between gap-4 py-2 border-b border-rose-100/30 text-[11px] text-gray-600 font-semibold"
                            style={{
                              height: `${virtualRow.size}px`,
                              transform: `translateY(${virtualRow.start}px)`,
                            }}
                          >
                            <div className="text-left flex items-center gap-2">
                              <span className="font-mono bg-rose-50 border border-rose-100 text-rose-700 text-[9px] px-1.5 py-0.5 rounded">
                                Row {err.row}
                              </span>
                              <span>Failed parsing column: <strong className="text-indigo-950 font-extrabold">{err.field}</strong></span>
                            </div>
                            <span className="text-rose-600 font-semibold italic">{err.message}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-3 justify-end pt-4 border-t border-indigo-150/40">
                <button
                  onClick={resetWizard}
                  className="px-5 py-2.5 border border-indigo-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartInjection}
                  disabled={validCount === 0}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-white font-bold rounded-xl text-xs shadow-md hover:shadow-indigo-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Inject Valid Records</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            /* STEP 3: PROCESSING PROGRESS BAR */
            <motion.div
              key="step-processing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                {/* Simulated database syncing animation */}
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <Database className="w-6 h-6 text-indigo-600" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-sm font-black text-indigo-950">Synchronizing Relational Nodes</h4>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Inserting {validCount} verified student records into the core Elevate Edu relational database cluster...
                </p>
              </div>

              {/* Progress bar container */}
              <div className="w-full max-w-md">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-indigo-600 mb-2">
                  <span>DATA STREAMING ACTIVE</span>
                  <span>{progress}%</span>
                </div>
                
                <div className="w-full h-2.5 bg-indigo-50 rounded-full overflow-hidden border border-indigo-100/30">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    layoutId="progress-bar-fill"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            /* STEP 4: SUCCESS */
            <motion.div
              key="step-success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/5 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display text-lg font-black text-indigo-950">Data Ingestion Completed</h4>
                <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                  Excellent! <strong className="text-indigo-950 font-black">{validCount} student records</strong> were successfully formatted, authorized, and synchronized in-memory.
                </p>
              </div>

              <div className="pt-4 w-full flex justify-center">
                <button
                  onClick={handleFinalizeImport}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/10 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Finalize Roster Sync
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
