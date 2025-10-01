import { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage, SessionContext, AppScreen, EvaluationData } from '../types';
import { EVALUATION_QUESTIONS, PROTOCOLS } from '../constants';

const API_KEY = process.env.API_KEY;

export const useAiAssistant = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [sessionContext, setSessionContext] = useState<SessionContext>({ evaluationData: null });
  
  const messageCounter = useRef(0);
  const triggeredScreens = useRef(new Set<string>());

  const addMessage = useCallback((sender: 'bot' | 'user', text: string) => {
    setMessages(prev => [...prev, { id: messageCounter.current++, sender, text }]);
  }, []);

  const internalSendMessage = useCallback(async (prompt: string) => {
    if (!chat) return null;
    setIsAiResponding(true);
    let responseText = "Lo siento, no pude procesar esa respuesta.";
    try {
      const response = await chat.sendMessage({ message: prompt });
      responseText = response.text;
    } catch (error) {
      console.error("Error sending message to AI:", error);
    } finally {
      addMessage('bot', responseText);
      setIsAiResponding(false);
      return responseText;
    }
  }, [chat, addMessage]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!API_KEY) {
        addMessage('bot', 'Error: API key no encontrada. El asistente no puede funcionar.');
        return;
      }
      try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const systemInstruction = `Eres un terapeuta digital experto y compasivo llamado "Asistente Mariposa". Te especializas en el "Método de Mariposa para la Transformación del Trauma". Tu rol es ser el director inteligente de la sesión terapéutica.
        
        Tus responsabilidades principales son:
        1.  **Analizar Datos:** Evaluar la información inicial del usuario para entender su herida y disparador.
        2.  **Crear Planes de Sanación:** Diseñar una secuencia de protocolos de tapping personalizada y dinámica basada en el análisis. Justificarás brevemente el plan al usuario.
        3.  **Guiar Paso a Paso:** Proporcionar instrucciones claras, contexto y aliento en cada etapa (Evaluación, Mapeo, Sesión, Resumen).
        4.  **Responder con Empatía:** Contestar las preguntas del usuario manteniendo un tono compasivo, directo, validador y empoderador. Mantén el contexto de la sesión.
        5.  **Mantener la Seguridad:** Si el usuario expresa angustia severa (ideación suicida), prioriza su seguridad indicándole que contacte servicios de emergencia de inmediato.
        
        Mantén tus respuestas concisas y enfocadas en el proceso terapéutico. NO proporciones consejos médicos. Recibirás indicaciones programáticas sobre el progreso del usuario y el contexto de la sesión para guiar tus respuestas.`;
        
        const newChat = ai.chats.create({ model: 'gemini-2.5-flash', systemInstruction });
        setChat(newChat);
      } catch (error) {
        console.error("Error initializing AI:", error);
        addMessage("bot", "Lo siento, estoy teniendo problemas para conectarme. La guía IA no estará disponible.");
      }
    };
    initializeChat();
  }, [addMessage]);
  
  const sendMessage = useCallback((text: string) => {
    addMessage('user', text);
    internalSendMessage(text);
  }, [addMessage, internalSendMessage]);

  const generateSessionPlan = useCallback(async (data: EvaluationData): Promise<string[]> => {
    setSessionContext({ evaluationData: data });
    if (!chat) return ['A', 'B', 'C', 'D', 'E', 'F', 'H']; // Fallback sequence
    
    addMessage('bot', 'Analizando tu evaluación para crear un plan de sanación personalizado...');
    setIsAiResponding(true);

    const prompt = `Un usuario ha completado su evaluación. Sus datos son: ${JSON.stringify(data)}. 
    Actuando como un experto en el Método Mariposa, crea una secuencia de protocolos de sanación personalizada para este usuario.
    Considera su emoción principal ('${data.emotion}') y su creencia negativa ('${data.negativeBelief}') para determinar si se necesita un protocolo 'G' específico (ej. 'G3' para vacío, 'G4' para desolación).
    Devuelve SÓLO un array JSON con las claves de los protocolos en el orden recomendado. Ejemplo de respuesta: ["A", "B", "G3", "C", "D", "E", "F", "H"]`;

    try {
        const response = await chat.sendMessage({
            message: prompt,
        });

        const planText = response.text.replace(/```json|```/g, '').trim();
        const plan = JSON.parse(planText);
      
        if (Array.isArray(plan) && plan.every(p => typeof p === 'string' && PROTOCOLS[p])) {
            internalSendMessage(`He creado un plan personalizado para ti basado en lo que compartiste. Nos enfocaremos en validar tus sentimientos, conectar con la herida original, separar el pasado del presente y fortalecer tu identidad adulta. He incluido pasos específicos para abordar la emoción de '${data.emotion}'.`);
            return plan;
        }
    } catch (error) {
      console.error("Failed to generate or parse session plan:", error);
      internalSendMessage("No pude crear un plan personalizado en este momento. Seguiremos una secuencia estándar de sanación que es muy efectiva.");
    } finally {
      setIsAiResponding(false);
    }
    return ['A', 'B', 'C', 'D', 'E', 'F', 'H']; // Fallback
  }, [chat, addMessage, internalSendMessage]);

  const notifyScreenChange = useCallback((screen: AppScreen, data?: any) => {
    const screenKey = screen + (screen === 'summary' ? JSON.stringify(data) : '');
    if (chat && !triggeredScreens.current.has(screenKey)) {
        triggeredScreens.current.add(screenKey);
        let prompt = '';
        switch(screen) {
            case 'welcome':
                prompt = "Acabo de abrir la aplicación. Dame una cálida bienvenida, preséntate y explica brevemente tu propósito. Anímame a comenzar.";
                break;
            case 'evaluation':
                prompt = "He comenzado la evaluación. Explica que estas preguntas son para entender la conexión entre mis sentimientos y mis experiencias pasadas. Anímame a ser honesto.";
                break;
            case 'mapping':
                setSessionContext({ evaluationData: data as EvaluationData });
                prompt = `He finalizado la evaluación y estoy en la pantalla de mapeo. Mis datos son: ${JSON.stringify(data)}. Explica cómo mi situación actual es un 'espejo' de mi herida original. Valida mis sentimientos.`;
                break;
            case 'session':
                prompt = "Estoy a punto de comenzar la sesión de tapping. Explica el proceso brevemente (brazos cruzados, golpecitos, frases) y asegúrame que me guiarás.";
                break;
            case 'summary':
                prompt = `He completado la sesión. Mi informe de progreso es: ${JSON.stringify(data)}. Felicítame por el trabajo. Explica brevemente el significado de los cambios en SUDS y VoC.`;
                break;
        }
        if (prompt) internalSendMessage(prompt);
    }
  }, [chat, internalSendMessage]);
  
  const notifyEvaluationStepChange = useCallback((step: number) => {
      const question = EVALUATION_QUESTIONS[step];
      const prompt = `Estoy en el paso ${step + 1} de la evaluación: "${question.label}". Explica brevemente el propósito de esta pregunta.`;
      internalSendMessage(prompt);
  }, [internalSendMessage]);

  const notifyProtocolChange = useCallback((protocolKey: string) => {
       const protocol = PROTOCOLS[protocolKey];
       if (!protocol) return;
       const prompt = `Voy a comenzar el Protocolo ${protocolKey}: ${protocol.name}. Explica brevemente su propósito: "${protocol.description}"`;
       internalSendMessage(prompt);
    }, [internalSendMessage]);
    
  const notifyModalOpen = useCallback((modalType: 'suds' | 'voc') => {
        const prompt = modalType === 'suds' 
            ? "Estoy en un punto de control de SUDS. Explica que es un momento para verificar mi intensidad emocional y ver el progreso."
            : "Estoy en el punto de control de VoC. Explica que necesito calificar cuán verdadera se siente la cognición positiva, midiendo el cambio en mis creencias.";
        internalSendMessage(prompt);
  }, [internalSendMessage]);

  return {
    messages,
    isAssistantOpen,
    isAiResponding,
    toggleAssistant: () => setIsAssistantOpen(p => !p),
    sendMessage,
    notifyScreenChange,
    notifyEvaluationStepChange,
    notifyProtocolChange,
    notifyModalOpen,
    generateSessionPlan
  };
};
