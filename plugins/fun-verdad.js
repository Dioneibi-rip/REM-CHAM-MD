import fetch from 'node-fetch';

// Función que traduce un texto usando la API de Google Translate
async function translateGoogle(text, fromLang, toLang) {
  // Construye la URL para llamar a la API no oficial de Google Translate
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx' +
    '&sl=' + fromLang +
    '&tl=' + toLang +
    '&dt=t&q=' + encodeURIComponent(text);

  // Hace la petición a la API
  const response = await fetch(url);
  const data = await response.json();

  // Devuelve el texto traducido que está en data[0][0][0]
  return data[0][0][0];
}

// Handler del comando
let handler = async (m, { conn }) => {
  // URL de una API que devuelve frases de verdad/verdad o reto (truth)
  let apiUrl = 'https://shizoapi.onrender.com/truth';

  // Hace la petición a la API externa
  let res = await fetch(apiUrl);

  // Si la respuesta no es correcta lanza un error
  if (!res.ok) throw new Error(await res.text());

  // Obtiene el JSON de la respuesta
  let json = await res.json();

  // Extrae la frase en inglés (supongo que json.text contiene la frase)
  let englishText = json.text;

  // Traduce la frase de inglés a español usando la función anterior
  let translatedText = await translateGoogle(englishText, 'en', 'es');

  // Envía el texto traducido al chat, mencionando al usuario que invocó el comando
  conn.sendMessage(
    m.chat,
    {
      text: translatedText,
      mentions: [m.sender],
    },
    { quoted: m }
  );
};

// Configuraciones del comando
handler.help = ['truth'];          // Comando ayuda
handler.tags = ['fun'];            // Categoría
handler.command = /^(truth)$/i;    // Comando activador: "truth"

export default handler;
