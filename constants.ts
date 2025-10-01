
import { ProtocolLibrary } from './types';

export const EVALUATION_QUESTIONS = [
  { id: 'situation', label: '¿Qué situación actual te está generando malestar?', placeholder: 'Ej: Una discusión con mi pareja, una crítica en el trabajo...', type: 'text' },
  { id: 'involved', label: '¿Quién o qué está involucrado en esta situación?', placeholder: 'Ej: Mi jefe, mi hermana, una decisión importante...', type: 'text' },
  { id: 'emotion', label: '¿Qué emoción principal estás sintiendo?', type: 'select', options: ['Desolación', 'Miedo', 'Ansiedad', 'Vacío', 'Tristeza', 'Enojo', 'Vergüenza', 'Culpa', 'Impotencia'] },
  { id: 'bodyLocation', label: '¿Dónde sientes esta emoción en tu cuerpo?', placeholder: 'Ej: En el pecho, un nudo en la garganta...', type: 'text' },
  { id: 'suds', label: 'En una escala de 0 a 10, ¿qué tan intensa es esa emoción?', type: 'slider', min: 0, max: 10 },
  { id: 'firstTime', label: '¿Cuándo fue la primera vez que sentiste algo similar en tu vida?', placeholder: 'Ej: En la infancia, con mis padres, en la escuela...', type: 'text' },
  { id: 'firstInvolved', label: '¿Quién estaba involucrado en esa primera experiencia?', placeholder: 'Ej: Mi madre, mi padre, un profesor...', type: 'text' },
  { id: 'negativeBelief', label: '¿Qué creencia negativa se formó entonces sobre ti?', placeholder: 'Ej: "No soy suficiente", "No merezco amor", "Soy defectuoso"...', type: 'text' },
];

export const PROTOCOL_SEQUENCE = ['A', 'B', 'C', 'D', 'E', 'F', 'H'];

export const PROTOCOLS: ProtocolLibrary = {
  'A': {
    name: "PROTOCOLO A: RECONOCIMIENTO Y VALIDACIÓN",
    taps: 25,
    type: 'normal',
    description: "Para iniciar cualquier sesión y validar tu experiencia emocional.",
    phrases: [
      "`[emotion]` que siento es real y válida",
      "Tengo permiso de sentir lo que siento con `[involved]`",
      "No estoy exagerando, estoy procesando",
      "Mi experiencia tiene sentido dada mi historia",
      "`[situation]` tocó algo profundo en mí",
      "Este dolor es información, no debilidad",
    ]
  },
  'B': {
    name: "PROTOCOLO B: CONTACTO CON HERIDA ORIGINAL",
    taps: 35,
    type: 'arrullo',
    description: "Para conectar de forma segura con la memoria original de la herida.",
    phrases: [
      "Ese niño/a que sintió `[negativeBelief]` por primera vez, fui yo",
      "Esa experiencia con `[firstInvolved]` fue real",
      "Ese dolor es profundo y legítimo",
      "Ese niño/a necesitaba `[necesidad_no_cumplida]`",
      "Y no la recibió de `[firstInvolved]`",
      "Esa herida quedó sin sanar por mucho tiempo",
      "Y sigue apareciendo cuando `[situation]`",
    ]
  },
  'C': {
    name: "PROTOCOLO C: DIFERENCIACIÓN TEMPORAL",
    taps: 40,
    type: 'firme',
    description: "Para separar el pasado del presente y reconocer tus recursos actuales.",
    phrases: [
      "Eso pasó ENTONCES, no está pasando exactamente así ahora",
      "Ese niño/a vulnerable vivió eso, el adulto que soy hoy tiene recursos",
      "El pasado es pasado, el presente es diferente",
      "Aquella situación con `[firstInvolved]` terminó",
      "Hoy es `[fecha_actual]`, tengo `[edad_actual]` años",
      "No soy indefenso, soy capaz y resiliente",
      "Entonces no tenía opciones, ahora SÍ tengo opciones",
      "La herida es antigua, mi capacidad es presente",
    ]
  },
  'D': {
    name: "PROTOCOLO D: DIFERENCIACIÓN DE PERSONAS",
    taps: 45,
    type: 'firme',
    description: "Para separar a la figura original de la herida de la persona o situación actual.",
    phrases: [
      "`[firstInvolved]` es `[firstInvolved]`",
      "Él/Ella/Esa situación tuvo sus propias limitaciones",
      "Su acción fue SUYA, no sobre mi valor",
      "Ya no necesito su validación para tener valor",
      "Lo/La coloco en el pasado, donde pertenece",
      "`[involved]` NO es `[firstInvolved]`",
      "`[involved]` es solo una persona/situación en mi presente",
      "Su comportamiento es suyo, no un veredicto sobre mí",
      "Puedo manejar esta situación sin que signifique que soy `[negativeBelief]`",
    ]
  },
  'E': {
    name: "PROTOCOLO E: RESCATE DEL YO INTERIOR",
    taps: 50,
    type: 'arrullo',
    description: "Para sanar y proteger a tu parte herida desde tu fortaleza adulta.",
    phrases: [
      "Ese niño/a herido está aquí conmigo",
      "Lo/La veo, lo/la reconozco, lo/la valido",
      "Pero YO no soy solo ese niño/a",
      "Esa parte herida es UNA parte de mí, no TODO yo",
      "Yo crecí, me desarrollé, me fortalecí",
      "Puedo sostener a mi niño/a interior sin SER él/ella",
      "Él/Ella siente `[emotion]`, yo como adulto tengo recursos",
      "Lo/La sostengo con amor, pero no dejo que dirija mi vida adulta",
      "Le doy un lugar seguro dentro de mí",
      "Y desde mi fuerza adulta, me protejo y elijo mi bienestar",
    ]
  },
  'F': {
    name: "PROTOCOLO F: INSTALACIÓN DE IDENTIDAD ADULTA",
    taps: 50,
    type: 'firme',
    description: "Para fortalecer y anclar tus recursos y tu identidad presente.",
    phrases: [
      "SOY `[nombre]`, un adulto en el presente",
      "TENGO sabiduría, experiencia, y resiliencia",
      "PUEDO elegir, establecer límites y cuidarme",
      "MEREZCO paz, respeto y amor recíproco",
      "MI VALOR es intrínseco e innegociable",
      "ELIJO mi bienestar por encima de patrones antiguos",
      "DECIDO actuar basado en mi sabiduría adulta",
      "CONFÍO en mi capacidad para manejar `[situation]`",
      "SOY CAPAZ de construir un futuro sano",
      "Siento como `[positiveCognition]` es cada vez más verdad.",
    ]
  },
  'G': {
    name: "PROTOCOLO G: MANEJO DE SÍNTOMAS ESPECÍFICOS",
    taps: 30,
    type: 'rapido',
    description: "Técnicas rápidas para manejar pensamientos o sensaciones intensas.",
    subProtocols: {
      'G1': {
        name: "Para Pensamientos Obsesivos",
        taps: 30,
        template: [
          "ALTO. Reconozco este bucle mental sobre `[situation]`",
          "Esto es mi mente evitando sentir `[emotion]`",
          "Este pensamiento es una historia, no un hecho",
          "Elijo enfocarme en mi respiración, aquí y ahora",
        ]
      },
      'G3': {
        name: "Para Sensación de Vacío",
        taps: 40,
        template: [
          "Este vacío NO lo creó `[involved]`",
          "Este vacío ya estaba desde la herida con `[firstInvolved]`",
          "No necesito nada externo para llenar este espacio",
          "YO lleno este vacío con mi propia presencia y amor",
        ]
      },
      'G4': {
        name: "Para Desolación Aguda",
        taps: 40,
        template: [
          "La desolación está aquí, la siento en `[bodyLocation]`",
          "Esta es la herida antigua activada por `[situation]`",
          "No es una emergencia, es una emoción intensa",
          "Mi yo adulto sostiene a mi parte herida ahora",
          "Esta desolación pasará, yo permanezco",
        ]
      }
    },
    phrases: []
  },
  'H': {
    name: "PROTOCOLO H: CIERRE E INTEGRACIÓN",
    taps: 35,
    type: 'normal',
    description: "Para finalizar la sesión, integrando los cambios y aprendizajes.",
    phrases: [
      "La herida con `[firstInvolved]` es pasado",
      "`[situation]` es presente, y tengo recursos para manejarla",
      "Mi parte herida está segura y protegida por mí",
      "YO SOY el adulto capaz que soy hoy",
      "Camino hacia adelante con más claridad y fuerza",
      "Mi historia me formó, pero no me define",
      "Llevo mi herida sanada como fuente de sabiduría",
      "Construyo mi futuro desde mi fortaleza presente",
    ]
  }
};
