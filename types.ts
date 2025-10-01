export type AppScreen = 'welcome' | 'evaluation' | 'mapping' | 'session' | 'summary';

export interface EvaluationData {
  situation: string;
  involved: string;
  emotion: string;
  bodyLocation: string;
  suds: number;
  firstTime: string;
  firstInvolved: string;
  negativeBelief: string;
  positiveCognition?: string; 
  voc?: number;
}

export type ProtocolKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface Protocol {
  name: string;
  taps: number;
  phrases: string[];
  type?: 'normal' | 'arrullo' | 'firme' | 'rapido';
  description?: string;
  subProtocols?: { [key: string]: SubProtocol };
}

export interface SubProtocol {
  name: string;
  taps: number;
  template: string[];
}

export interface ProtocolLibrary {
  [key: string]: Protocol;
}

export interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
}

export interface SessionContext {
  evaluationData: EvaluationData | null;
  // Puede expandirse para incluir más memoria de la sesión
}

export interface UseAiAssistant {
  messages: ChatMessage[];
  isAssistantOpen: boolean;
  isAiResponding: boolean;
  toggleAssistant: () => void;
  sendMessage: (text: string) => void;
  notifyScreenChange: (screen: AppScreen, data?: any) => void;
  notifyEvaluationStepChange: (step: number) => void;
  notifyProtocolChange: (protocolKey: string) => void;
  notifyModalOpen: (modalType: 'suds' | 'voc') => void;
  generateSessionPlan: (data: EvaluationData) => Promise<string[]>;
}
