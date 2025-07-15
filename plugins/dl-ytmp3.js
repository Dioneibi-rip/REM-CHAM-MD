import axios from "axios";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import os from "os";

let streamPipeline = promisify(pipeline);

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(m.chat, `*_々 Ingresa un enlace de YouTube_*\n\n*Ejemplo:*\n${usedPrefix + command} https://youtu.be/HhJ-EWRMAJE`, m);
  }

  try {
    let videoUrl = encodeURIComponent(text.trim());
    let apiKey = 'stellar-bFA8UWSA';
    let apiUrl = `https://api.stellarwa.xyz/dow/ytmp3?url=${videoUrl}&apikey=${apiKey}`;

    await m.react("⏱");

    let response = await axios.get(apiUrl);
    let data = response.data;

    if (!data.status || !data.data?.dl) throw new Error("❌ Error al obtener datos del audio");

    let { title, thumbnail, dl: audioUrl } = data.data;

    if (!title || title === "-") title = "𝘼𝙐𝘿𝙄𝙊 𝙀𝙎𝙏𝙀𝙇𝙇𝘼𝙍 💙";

    let tmpDir = os.tmpdir();
    let fileName = `${title}.mp3`;
    let filePath = `${tmpDir}/${fileName}`;

    let audioResponse = await axios({
      url: audioUrl,
      method: 'GET',
      responseType: 'stream'
    });

    let writableStream = fs.createWriteStream(filePath);
    await streamPipeline(audioResponse.data, writableStream);

    let doc = {
      audio: {
        url: filePath,
      },
      mimetype: "audio/mp4",
      fileName: title,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: text,
          title: title,
          sourceUrl: text,
          thumbnail: await (await conn.getFile(thumbnail)).data,
        },
      },
    };

    await conn.sendMessage(m.chat, doc, { quoted: m });
    await m.react("✅");

  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, `❌ No se pudo descargar el audio. Verifica el enlace o inténtalo más tarde.`, m);
    await m.react("❌");
  }
};

handler.help = ["ytmp3"].map((v) => v + " <url>");
handler.tags = ["descargas"];
handler.command = /^(ytmp3|yta)$/i;
handler.register = true;

export default handler;
