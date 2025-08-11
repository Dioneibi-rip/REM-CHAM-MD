import fetch from 'node-fetch';
import axios from 'axios';

async function sendMessage(message) {
  try {
    const res = await fetch(
      `https://rembot-caracteria-api.up.railway.app/ciaapp/ＲＥＭ ＣＨＡＭ?mensaje=${encodeURIComponent(message)}`,
      {
        method: 'GET',
        headers: { accept: 'application/json' }
      }
    );
    const data = await res.json();
    return data.data.respuesta;
  } catch (err) {
    throw "ERROR: " + err;
  }
}

let handler = async (m, { text }) => {
  if (!text)
    return m.reply("Por favor ingresa un mensaje después de tu comando <mensaje>");

  try {
    const respuesta = await sendMessage(text);
    const textoRespuesta = "respuesta: " + respuesta;
    const titulo = "ʀᴇᴍ ʙᴏᴛ";
    const imagenURL =
      "https://i.pinimg.com/564x/ee/23/92/ee239d56524.jpg";
    const sourceUrl = "https://github.com/davidprospe/mbot-caracter-ia";

    const thumbRes = await axios.get(imagenURL, { responseType: "arraybuffer" });

    await conn.reply(
      m.chat,
      textoRespuesta,
      m,
      {
        contextInfo: {
          forwardingScore: 2022,
          externalAdReply: {
            title: titulo,
            body: "*ʀᴇᴍ ᴄʜᴀᴍ*",
            thumbnail: thumbRes.data,
            sourceUrl
          }
        }
      }
    );
  } catch (err) {
    m.reply("ERROR: " + err);
  }
};

handler.help = ["rem <mensaje>", ".rem seguir <mensaje>"];
handler.tags = ["rem", "ʀᴇᴍ ʙᴏᴛ"];
handler.command = /^rem$/i;
handler.register = true;

export default handler;
