import fetch from 'node-fetch';

async function translateGoogle(text, sourceLang, targetLang) {
  // Realiza una traducción usando la API de Google Translate (no oficial, vía web)
  const url = 
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  const response = await fetch(url);
  const data = await response.json();

  // La traducción suele estar en data[0][0][0]
  return data[0][0][0];
}

let handler = async (m, { conn }) => {
  // URL fija para obtener algún texto (probablemente "verdad" / truth)
  const apiUrl = 'https://shizuoapi.onrender.com/api/texts/truth?apikey=1246924ZjByPl';

  // Solicita datos al API
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();

  // Extrae el texto original
  const originalText = json.result;

  // Traduce el texto de inglés a español
  const translatedText = await translateGoogle(originalText, 'en', 'es');

  // Envía la traducción en el chat, mencionando al remitente y citando el mensaje original
  await conn.sendMessage(m.chat, { text: translatedText, mentions: [m.sender] }, { quoted: m });
};

handler.help = ['truth'];
handler.tags = ['fun'];
handler.command = /^(truth)$/i;

export default handler;
