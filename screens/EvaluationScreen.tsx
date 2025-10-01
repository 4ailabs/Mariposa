import React, { useState, useEffect } from 'react';
import { EvaluationData } from '../types';
import { EVALUATION_QUESTIONS } from '../constants';
import Card from '../components/Card';
import ButterflyIcon from '../components/ButterflyIcon';

interface EvaluationScreenProps {
  onComplete: (data: EvaluationData) => void;
  onStepChange: (step: number) => void;
}

const generatePositiveCognition = (belief: string): string => {
    const lowerBelief = belief.toLowerCase();
    if (lowerBelief.includes("no soy suficiente")) return "Soy suficiente tal como soy.";
    if (lowerBelief.includes("no merezco")) return "Merezco amor, paz y éxito.";
    if (lowerBelief.includes("defectuoso")) return "Soy un ser humano completo y valioso.";
    if (lowerBelief.includes("no puedo confiar")) return "Puedo aprender a confiar en mí mismo y en los demás de forma segura.";
    if (lowerBelief.includes("me abandonan") || lowerBelief.includes("me rechazan")) return "Puedo construir relaciones seguras y soy digno de pertenencia.";
    if (lowerBelief.includes("no tengo valor")) return "Mi valor es intrínseco e incondicional.";
    return `Soy capaz, valioso y merecedor de lo bueno.`;
};

const EvaluationScreen: React.FC<EvaluationScreenProps> = ({ onComplete, onStepChange }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<EvaluationData>>({ suds: 5 });

  useEffect(() => {
    onStepChange(step);
  }, [step, onStepChange]);

  const currentQuestion = EVALUATION_QUESTIONS[step];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < EVALUATION_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const positiveCognition = generatePositiveCognition(formData.negativeBelief || "");
      const completeData = {
          ...formData,
          positiveCognition,
          voc: 1, // Start VoC at 1 (completely false)
      } as EvaluationData;
      onComplete(completeData);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: id === 'suds' ? parseInt(value, 10) : value }));
  };
  
  const progress = ((step + 1) / EVALUATION_QUESTIONS.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
       <div className="flex items-center mb-4">
            <ButterflyIcon className="w-8 h-8 text-violet-500 mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-slate-700">Evaluación Inicial</h2>
       </div>
       <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
          <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
       </div>

      <form onSubmit={handleNext}>
        <div className="mb-6 min-h-[150px]">
          <label htmlFor={currentQuestion.id} className="block text-lg font-medium text-slate-700 mb-2">{currentQuestion.label}</label>
          {currentQuestion.type === 'text' && (
            <input
              type="text"
              id={currentQuestion.id}
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
              placeholder={currentQuestion.placeholder}
              value={formData[currentQuestion.id as keyof EvaluationData] as string || ''}
              onChange={handleChange}
              autoFocus={step > 0}
            />
          )}
          {currentQuestion.type === 'select' && (
             <select id={currentQuestion.id} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition bg-white" value={formData[currentQuestion.id as keyof EvaluationData] as string || ''} onChange={handleChange}>
                <option value="" disabled>Selecciona una emoción...</option>
                {currentQuestion.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
             </select>
          )}
          {currentQuestion.type === 'slider' && (
            <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id={currentQuestion.id}
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                  value={formData.suds || 5}
                  onChange={handleChange}
                />
                <span className="font-bold text-violet-600 text-xl w-12 text-center">{formData.suds}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button type="button" onClick={handleBack} disabled={step === 0} className="text-slate-500 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Atrás
          </button>
          <button type="submit" className="bg-violet-600 text-white font-bold py-2 px-6 rounded-full hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all duration-300 transform hover:scale-105">
            {step === EVALUATION_QUESTIONS.length - 1 ? 'Finalizar Evaluación' : 'Siguiente'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default EvaluationScreen;
