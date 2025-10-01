
import React from 'react';
import Card from '../components/Card';
import ButterflyIcon from '../components/ButterflyIcon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <Card className="max-w-2xl w-full animate-fade-in-up">
        <div className="flex flex-col items-center">
          <ButterflyIcon className="w-16 h-16 text-violet-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-serif">
            Método de Mariposa
          </h1>
          <p className="text-lg text-slate-600 mb-2">
            Un sistema de transformación para sanar heridas del pasado.
          </p>
          <p className="text-slate-500 mb-8 max-w-prose">
            Este es un espacio seguro para explorar lo que estás sintiendo. A través de un proceso guiado, conectaremos las dificultades presentes con sus raíces para facilitar una sanación profunda y duradera.
          </p>
          <button
            onClick={onStart}
            className="bg-violet-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Comenzar Proceso
          </button>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
