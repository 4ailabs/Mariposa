import React, { useState, useCallback, useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import EvaluationScreen from './screens/EvaluationScreen';
import MappingScreen from './screens/MappingScreen';
import SessionScreen from './screens/SessionScreen';
import SummaryScreen from './screens/SummaryScreen';
import { AppScreen, EvaluationData } from './types';
import ChatAssistant from './components/ChatAssistant';
import { useAiAssistant } from './hooks/useAiAssistant';
import Card from './components/Card';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const [sessionReport, setSessionReport] = useState<{sudsStart: number; sudsEnd: number; vocStart: number; vocEnd: number} | null>(null);
  const [protocolSequence, setProtocolSequence] = useState<string[]>([]);
  
  const assistant = useAiAssistant();

  useEffect(() => {
    assistant.notifyScreenChange(screen, screen === 'summary' ? sessionReport : evaluationData);
  }, [screen, evaluationData, sessionReport, assistant]);

  const handleEvaluationComplete = useCallback(async (data: EvaluationData) => { 
    setEvaluationData(data); 
    setScreen('mapping'); // Go to mapping screen immediately
    const plan = await assistant.generateSessionPlan(data);
    setProtocolSequence(plan);
  }, [assistant]);

  const handleStart = useCallback(() => { setScreen('evaluation'); }, []);
  const handleMappingComplete = useCallback(() => { setScreen('session'); }, []);
  const handleSessionComplete = useCallback((report: {sudsStart: number; sudsEnd: number; vocStart: number; vocEnd: number}) => { setSessionReport(report); setScreen('summary'); }, []);
  const handleRestart = useCallback(() => {
    // A full page reload is the simplest way to reset everything including AI state.
    window.location.reload();
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'welcome': return <WelcomeScreen onStart={handleStart} />;
      case 'evaluation': return <EvaluationScreen onComplete={handleEvaluationComplete} onStepChange={assistant.notifyEvaluationStepChange} />;
      case 'mapping':
        if (evaluationData) return <MappingScreen data={evaluationData} onComplete={handleMappingComplete} />;
        handleRestart(); return null;
      case 'session':
        if (evaluationData && protocolSequence.length > 0) {
            return <SessionScreen data={evaluationData} protocolSequence={protocolSequence} onComplete={handleSessionComplete} onProtocolChange={assistant.notifyProtocolChange} onModalOpen={assistant.notifyModalOpen} />;
        }
        if (evaluationData) {
            return <Card><p className="text-center">Creando tu plan de sesión personalizado...</p></Card>;
        }
        handleRestart(); return null;
      case 'summary':
        if(evaluationData && sessionReport) return <SummaryScreen data={evaluationData} report={sessionReport} onRestart={handleRestart} />;
        handleRestart(); return null;
      default: return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto transition-all duration-500">
        {renderScreen()}
      </main>
      <ChatAssistant 
        messages={assistant.messages} 
        isOpen={assistant.isAssistantOpen} 
        onToggle={assistant.toggleAssistant}
        onSendMessage={assistant.sendMessage}
        isResponding={assistant.isAiResponding}
      />
    </div>
  );
};

export default App;
