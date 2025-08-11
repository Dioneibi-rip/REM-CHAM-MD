import fetch from 'node-fetch';

async function translateGoogle(text, fromLang, toLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data[0][0][0];
}

let handler = async (message, { conn }) => {
  const apiBase = 'https://shizoapi.onrender.com/api/texts/truth?apikey=shizo';

  const response = await fetch(apiBase);
  
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const json = await response.json();

  const originalText = json.text;

  const translatedText = await translateGoogle(originalText, 'en', 'es');

  await conn.sendMessage(message.chat, { text: translatedText, mentions: [message.sender] }, { quoted: message });
};

handler.help = ['verdad'];
handler.tags = ['fun'];
handler.command = /^(verdad|truth)$/i;

export default handler;
