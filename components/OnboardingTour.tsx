import React from 'react';
import { X, ArrowRight, Check, Bot } from 'lucide-react';

export interface TourStep {
  title: string;
  description: string;
  targetView?: string;
}

interface Props {
  step: number;
  totalSteps: number;
  currentStepData: TourStep;
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingTour: React.FC<Props> = ({ 
  step, 
  totalSteps, 
  currentStepData, 
  onNext, 
  onSkip 
}) => {
  const isLastStep = step === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-end sm:justify-end p-4 sm:p-8">
      {/* Backdrop for mobile focus */}
      <div className="absolute inset-0 bg-slate-900/20 sm:bg-transparent pointer-events-auto sm:pointer-events-none transition-opacity" />

      <div className="pointer-events-auto w-full sm:w-96 bg-white rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-6 relative animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        {/* Decor: Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-yellow-200/80 rotate-1 border border-yellow-400/50 shadow-sm"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-200 rounded-lg border-2 border-slate-900 flex items-center justify-center -rotate-3 shadow-sm">
              <Bot size={24} className="text-emerald-800" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 leading-none">{currentStepData.title}</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step {step + 1} of {totalSteps}
              </span>
            </div>
          </div>
          <button 
            onClick={onSkip}
            className="text-slate-400 hover:text-slate-900 transition-colors"
            title="End Tour"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">
          {currentStepData.description}
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2.5 h-2.5 rounded-full border border-slate-900 transition-colors ${idx === step ? 'bg-slate-900' : 'bg-slate-200'}`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-xl border-2 border-slate-900 font-bold transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
              ${isLastStep ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-slate-900 text-white hover:bg-slate-800'}
            `}
          >
            {isLastStep ? 'Let\'s Go!' : 'Next'}
            {isLastStep ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
