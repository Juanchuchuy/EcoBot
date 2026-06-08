const respuestas = {
  'pila': `Las pilas deben llevarse a puntos de recolección especiales
(puntos limpios, supermercados o municipios).
Nunca las tires al tacho común: una sola pila puede contaminar
600.000 litros de agua.`,

  'plástico': `El plástico va al contenedor amarillo.
Antes de tirarlo, enjuagá el envase y aplastalo para ahorrar espacio.
Las bolsas plásticas podés llevarlas a supermercados habilitados.`,

  'papel': `El papel y cartón va al contenedor azul.
Asegurate de que esté seco y limpio — el papel mojado
o con grasa no se puede reciclar.`,

  'cartón': `El cartón va al contenedor azul, igual que el papel.
Desarmá las cajas para que ocupen menos espacio.`,

  'vidrio': `El vidrio va al contenedor verde.
Enjuagá los frascos antes de tirarlos.
No mezcles vidrio de ventanas con el de envases,
tienen composición diferente.`,

  'medicamento': `Los medicamentos vencidos o en desuso deben llevarse
a farmacias habilitadas o puntos limpios municipales.
Nunca los tires al tacho ni los descargues por el inodoro.`,

  'aceite': `El aceite de cocina usado nunca va por el desagüe,
tapa las cañerías y contamina el agua.
Guardalo en botellas cerradas y llevalo a puntos limpios
donde lo transforman en biodiesel.`,

  'compost': `Para hacer compost en casa necesitás una compostera
(puede ser un balde con tapa).
Agregá cáscaras de frutas, verduras, yerba y posos de café.
Evitá carnes, lácteos y grasas. En unas semanas tenés abono natural.`,

  'camión': `Para saber el horario del camión de basura en tu zona,
¡tenemos el bot de WhatsApp!
Te manda el horario automáticamente la noche anterior.
Hacé clic en "Suscribirme" en el panel izquierdo.`,

  'electrónico': `Los residuos electrónicos (celulares, computadoras, cables)
van a puntos de recolección específicos, llamados "e-waste".
Muchos municipios y marcas tienen programas de recolección gratuita.`,

  'batería': `Las baterías, igual que las pilas, van a puntos de
recolección especiales. Nunca al tacho común.
Muchos supermercados tienen contenedores específicos para esto.`,

'hola': `Hola! Soy EcoBot mi trabajo es informarte acerca de como puedes reciclar con responsabilidad.
 Esta es mi version web, para tener mis respuestas completas dale click al boton de mi izquierda.`,



};

const respuestaDefault = `No encontré información sobre eso todavía.Probá preguntarme sobre: pilas, plástico, papel, vidrio,medicamentos, aceite, compost, electrónicos o el camión de basura.`;

function obtenerRespuesta(mensaje){

  const msj = mensaje.toLowerCase()

  for(const [clave,respuesta] of Object.entries(respuestas)){

    if(msj.includes(clave)){

      return respuesta;

    }

  }
  return respuestaDefault;


}

function horaActual() {
  return new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function agregarMensaje(texto,esBot){

  const contenedor = document.getElementById("Chatbot-chat");

  const div = document.createElement("div");

  div.className =  `Chatbot-chat-${esBot ? 'bot' : 'user'}`;

  div.innerHTML = `
    <div class="Chatbot-chat-bubble">${texto.replace(/\n/g, '<br>')}</div>
    <div class="Chatbot-chat-time">${horaActual()}</div>
  `;
  
  contenedor.appendChild(div);
  contenedor.scrollTop = contenedor.scrollHeight;

}

function enviar(){

  const input = document.getElementById("Chat-input");
  const texto = input.value.trim();

  if(!texto){return}

  agregarMensaje(texto,false);

  input.value = '';
  input.focus();

  setTimeout(() => {

    const respuesta = obtenerRespuesta(texto);
    agregarMensaje(respuesta,true)

  },500)

}

function enviarRapido(texto) {

  agregarMensaje(texto,false);
  setTimeout(() =>{

    const respuesta = obtenerRespuesta(texto);
    agregarMensaje(respuesta,true)


  },300)

}


window.addEventListener('DOMContentLoaded', () => {
  agregarMensaje(
    `¡Hola! Soy EcoBot 🌱\nPreguntame sobre reciclaje, residuos o puntos de recolección.\nPara saber cuándo pasa el camión, suscribite al bot de WhatsApp desde el panel izquierdo.`,
    true
  );
});
