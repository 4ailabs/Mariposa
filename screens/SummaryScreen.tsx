import React from 'react';
import { EvaluationData } from '../types';
import Card from '../components/Card';
import { PROTOCOLS } from '../constants';

interface SummaryScreenProps {
  data: EvaluationData;
  report: { sudsStart: number; sudsEnd: number; vocStart: number; vocEnd: number; };
  onRestart: () => void;
}

const EmergencyProtocolCard: React.FC = () => {
    const crisisProtocol = PROTOCOLS['G'].subProtocols?.['G4'];
    if (!crisisProtocol) return null;
    return (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
            <h4 className="font-bold text-rose-800">Protocolo Rápido de Crisis</h4>
            <p className="text-sm text-rose-700">Si sientes una activación intensa, recuerda:</p>
            <ul className="list-disc list-inside text-sm text-rose-600 mt-2 space-y-1">
                <li><strong>Reconoce:</strong> "Esta emoción está aquí. Es una activación, no una emergencia vital."</li>
                <li><strong>Diferencia:</strong> "Esto es memoria antigua, no la realidad presente."</li>
                <li><strong>Anclaje:</strong> Respira profundo. "Estoy presente y a salvo aquí y ahora."</li>
            </ul>
        </div>
    );
};


const SummaryScreen: React.FC<SummaryScreenProps> = ({ data, report, onRestart }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-800 mb-4">Resumen de la Sesión</h2>
        <p className="text-slate-600 mb-8">Has hecho un trabajo valiente y profundo hoy. Aquí está tu progreso.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* SUDS Progress */}
        <div className="bg-slate-100 p-6 rounded-lg">
          <h3 className="font-semibold text-lg text-slate-700 mb-2">Intensidad de la Emoción (SUDS)</h3>
          <p className="text-sm text-slate-500 mb-3">Escala de Unidades Subjetivas de Angustia (0-10)</p>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-4xl font-bold text-slate-500">{report.sudsStart}</p>
              <p className="text-sm text-slate-500">Inicio</p>
            </div>
            <div className="text-2xl text-slate-400">&rarr;</div>
            <div className="text-center">
              <p className="text-4xl font-bold text-violet-600">{report.sudsEnd}</p>
              <p className="text-sm text-violet-600">Final</p>
            </div>
          </div>
        </div>

        {/* VoC Progress */}
        <div className="bg-slate-100 p-6 rounded-lg">
          <h3 className="font-semibold text-lg text-slate-700 mb-2">Validez de la Cognición (VoC)</h3>
          <p className="text-sm text-slate-500 mb-1">Qué tan verdadera se siente la frase (1-7):</p>
          <p className="italic text-slate-600 text-center mb-2">"{data.positiveCognition}"</p>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-4xl font-bold text-slate-500">{report.vocStart}</p>
              <p className="text-sm text-slate-500">Inicio</p>
            </div>
            <div className="text-2xl text-slate-400">&rarr;</div>
            <div className="text-center">
              <p className="text-4xl font-bold text-violet-600">{report.vocEnd}</p>
              <p className="text-sm text-violet-600">Final</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-violet-50 border border-violet-200 p-6 rounded-lg mb-8">
        <h3 className="font-bold text-xl text-violet-800 mb-4">Próximos Pasos y Mantenimiento</h3>
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-violet-700">Práctica Matutina (3 min)</h4>
                <p className="text-sm text-violet-600">Al despertar, haz unas palmaditas mientras afirmas: "Hoy es un nuevo día. Elijo actuar desde mi fortaleza adulta, no desde mis heridas pasadas."</p>
            </div>
            <div>
                <h4 className="font-semibold text-violet-700">Práctica Nocturna (5 min)</h4>
                <p className="text-sm text-violet-600">Antes de dormir, procesa tu día con compasión. "Hoy hice lo mejor que pude. Sostengo a mi parte herida con amor. Descanso en paz."</p>
            </div>
            <EmergencyProtocolCard />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-slate-600 mb-6">La sanación es un proceso. Sé amable contigo mismo/a y continúa practicando. Cada paso es un progreso.</p>
        <button
          onClick={onRestart}
          className="bg-violet-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Realizar otra sesión
        </button>
      </div>
    </Card>
  );
};

export default SummaryScreen;