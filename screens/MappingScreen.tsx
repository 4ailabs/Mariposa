
import React from 'react';
import { EvaluationData } from '../types';
import Card from '../components/Card';

interface MappingScreenProps {
  data: EvaluationData;
  onComplete: () => void;
}

const MappingScreen: React.FC<MappingScreenProps> = ({ data, onComplete }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-in text-center">
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-800 mb-6">Mapeo de Conexiones</h2>
      <p className="text-lg text-slate-600 mb-8">
        Lo que estás sintiendo con <strong className="text-violet-600">"{data.situation}"</strong> no es solo sobre eso. Tu sistema está recordando una herida más antigua.
      </p>

      <div className="grid md:grid-cols-2 gap-8 text-left">
        <div className="bg-slate-100 p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-xl text-slate-700 mb-3">Disparador Actual</h3>
          <p><strong className="font-semibold">Situación:</strong> {data.situation}</p>
          <p><strong className="font-semibold">Emoción:</strong> {data.emotion} (Intensidad: {data.suds}/10)</p>
          <p><strong className="font-semibold">Creencia Activada:</strong> "{data.negativeBelief}"</p>
        </div>

        <div className="bg-violet-100 p-6 rounded-lg border border-violet-200">
          <h3 className="font-bold text-xl text-violet-700 mb-3">Herida Original</h3>
          <p><strong className="font-semibold">Experiencia:</strong> {data.firstTime}</p>
          <p><strong className="font-semibold">Involucrado:</strong> {data.firstInvolved}</p>
          <p><strong className="font-semibold">Creencia Formada:</strong> "{data.negativeBelief}"</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xl font-serif text-slate-700 mb-8">
          La situación actual actúa como un <strong className="text-violet-700">espejo</strong> de la herida original. Ahora, vamos a trabajar con ambas capas para sanar desde la raíz.
        </p>
        <button
          onClick={onComplete}
          className="bg-violet-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Iniciar Sesión de Mariposa
        </button>
      </div>
    </Card>
  );
};

export default MappingScreen;
