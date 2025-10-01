import React, { useState, useEffect, useCallback } from 'react';
import { EvaluationData, ProtocolKey, Protocol } from '../types';
import { PROTOCOLS } from '../constants';
import ButterflyIcon from '../components/ButterflyIcon';
import Card from '../components/Card';

interface SessionScreenProps {
  data: EvaluationData;
  protocolSequence: string[];
  onComplete: (report: { sudsStart: number; sudsEnd: number; vocStart: number; vocEnd: number; }) => void;
  onProtocolChange: (protocolKey: string) => void;
  onModalOpen: (modalType: 'suds' | 'voc') => void;
}

const TappingVisualizer: React.FC<{ tapping: boolean }> = React.memo(({ tapping }) => {
  const [tapSide, setTapSide] = useState(false);
  
  useEffect(() => {
    let timer: number;
    if (tapping) {
      timer = window.setInterval(() => {
        setTapSide(prev => !prev);
      }, 400);
    }
    return () => clearInterval(timer);
  }, [tapping]);

  return (
    <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
      <div className={`absolute transition-transform duration-300 ${tapping ? 'scale-110' : 'scale-100'}`}>
        <ButterflyIcon className="w-24 h-24 text-violet-400" />
      </div>
      {/* These divs simulate the alternating tap glow */}
      <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-1/2 h-full bg-violet-200/50 rounded-full transition-all duration-200 ${tapping && tapSide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}></div>
      <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full bg-violet-200/50 rounded-full transition-all duration-200 ${tapping && !tapSide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}></div>
    </div>
  );
});

const interpolatePhrase = (phrase: string, data: EvaluationData): string => {
    const replacements: { [key: string]: string | number | undefined } = {
        'emotion': data.emotion,
        'involved': data.involved,
        'situation': data.situation,
        'negativeBelief': data.negativeBelief,
        'firstInvolved': data.firstInvolved,
        'necesidad_no_cumplida': 'amor y seguridad',
        'fecha_actual': new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'}),
        'edad_actual': 'adulta',
        'nombre': 'Yo',
        'positiveCognition': data.positiveCognition,
        'bodyLocation': data.bodyLocation,
    };

    return phrase.replace(/`\[([^\]]+)]`/g, (match, key) => {
        const cleanKey = key.trim();
        return String(replacements[cleanKey] || data[cleanKey as keyof EvaluationData] || match);
    });
};

const Modal: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; }> = ({ title, children, isOpen }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <Card className="w-full max-w-md animate-fade-in-up">
                <h3 className="text-2xl font-bold font-serif mb-4">{title}</h3>
                {children}
            </Card>
        </div>
    );
};

const SessionScreen: React.FC<SessionScreenProps> = ({ data, protocolSequence, onComplete, onProtocolChange, onModalOpen }) => {
  const [protocolIndex, setProtocolIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTapping, setIsTapping] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const [suds, setSuds] = useState(data.suds);
  const [voc, setVoc] = useState(data.voc || 1);
  const [showSudsModal, setShowSudsModal] = useState(false);
  const [showVocModal, setShowVocModal] = useState(false);

  const currentProtocolKey = protocolSequence[protocolIndex] as ProtocolKey;
  const currentProtocol = PROTOCOLS[currentProtocolKey];
  const currentPhrase = currentProtocol?.phrases[phraseIndex] || "";

  useEffect(() => {
    if (currentProtocolKey) {
        onProtocolChange(currentProtocolKey);
    }
  }, [protocolIndex, currentProtocolKey, onProtocolChange]);

  const handleNext = useCallback(() => {
    if (!currentProtocol) return;

    if (phraseIndex < currentProtocol.phrases.length - 1) {
      setPhraseIndex(p => p + 1);
    } else {
        const nextProtocolIndex = protocolIndex + 1;
        // Check for mid-session modals
        if (protocolSequence[protocolIndex] === 'C') {
            setIsPaused(true);
            onModalOpen('suds');
            setShowSudsModal(true);
            return;
        }
        if (protocolSequence[protocolIndex] === 'F') {
            setIsPaused(true);
            onModalOpen('voc');
            setShowVocModal(true);
            return;
        }

        if (nextProtocolIndex < protocolSequence.length) {
            setProtocolIndex(nextProtocolIndex);
            setPhraseIndex(0);
        } else {
            onComplete({ sudsStart: data.suds, sudsEnd: suds, vocStart: data.voc || 1, vocEnd: voc });
        }
    }
  }, [protocolIndex, phraseIndex, currentProtocol, protocolSequence, onComplete, data.suds, data.voc, suds, voc, onModalOpen]);

  useEffect(() => {
    if (isPaused || !currentProtocol) return;

    const tapDuration = 40000 / currentProtocol.taps;
    const interval = setInterval(() => {
      handleNext();
    }, Math.max(tapDuration, 3000));
    
    return () => clearInterval(interval);
  }, [isPaused, handleNext, currentProtocol]);
  
  useEffect(() => {
    setIsTapping(!isPaused);
  }, [isPaused]);

  const progress = (protocolIndex / protocolSequence.length) * 100;

  if (!currentProtocol) {
    return <Card>Cargando sesión...</Card>
  }

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto animate-fade-in">
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
          <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
        <div className="text-center">
            <h2 className="text-sm uppercase tracking-wider text-violet-500 font-semibold">{currentProtocol.name}</h2>
            <p className="text-slate-500 text-sm mb-4">{currentProtocol.description}</p>
            <TappingVisualizer tapping={isTapping} />
            <div className="min-h-[100px] flex items-center justify-center p-4 bg-slate-100 rounded-lg">
                <p className="text-xl md:text-2xl font-serif text-slate-700">
                    {interpolatePhrase(currentPhrase, data)}
                </p>
            </div>

            <div className="mt-6">
                <button 
                    onClick={() => setIsPaused(p => !p)}
                    className="bg-violet-600 text-white font-bold py-3 px-12 rounded-full text-lg hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    {isPaused ? 'Continuar' : 'Pausar'}
                </button>
            </div>
        </div>
      </Card>
      
      <Modal title="Comprobación de Progreso (SUDS)" isOpen={showSudsModal}>
        <p className="mb-4 text-slate-600">Has procesado una parte importante. Vuelve a conectar con la situación inicial. En una escala de 0-10, ¿qué tan intensa es la emoción ahora?</p>
        <div className="flex items-center space-x-4">
            <input type="range" min="0" max="10" value={suds} onChange={(e) => setSuds(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600" />
            <span className="font-bold text-violet-600 text-xl w-12 text-center">{suds}</span>
        </div>
        <button onClick={() => { setShowSudsModal(false); setProtocolIndex(p => p + 1); setPhraseIndex(0); setIsPaused(false); }} className="mt-6 w-full bg-violet-600 text-white font-bold py-2 px-6 rounded-full hover:bg-violet-700">Continuar Sesión</button>
      </Modal>

      <Modal title="Comprobación de Creencia (VoC)" isOpen={showVocModal}>
        <p className="mb-2 text-slate-600">Ahora, considera la frase positiva:</p>
        <p className="italic text-center bg-violet-100 p-2 rounded-md text-violet-800 mb-4">"{data.positiveCognition}"</p>
        <p className="mb-4 text-slate-600">En una escala de 1 (totalmente falsa) a 7 (totalmente verdadera), ¿qué tan verdadera se siente ahora?</p>
        <div className="flex items-center space-x-4">
            <input type="range" min="1" max="7" value={voc} onChange={(e) => setVoc(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600" />
            <span className="font-bold text-violet-600 text-xl w-12 text-center">{voc}</span>
        </div>
        <button onClick={() => { setShowVocModal(false); setProtocolIndex(p => p + 1); setPhraseIndex(0); setIsPaused(false); }} className="mt-6 w-full bg-violet-600 text-white font-bold py-2 px-6 rounded-full hover:bg-violet-700">Finalizar Sesión</button>
      </Modal>

    </>
  );
};

export default SessionScreen;
