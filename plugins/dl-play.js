import yts from "yt-search";
import axios from "axios";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import os from "os";
import fetch from "node-fetch";

const streamPipeline = promisify(pipeline);
const SIZE_LIMIT_MB = 100;

const handler = async (m, { conn, text, command }) => {
  if (!text) {
    return m.reply(
      `💙 *𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙚𝙨𝙘𝙧𝙞𝙗𝙚 𝙚𝙡 𝙣𝙤𝙢𝙗𝙧𝙚 𝙙𝙚 𝙪𝙣𝙖 𝙘𝙖𝙣𝙘𝙞𝙤́𝙣 𝙤 𝙥𝙚𝙜𝙖 𝙚𝙡 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚.*\n\n*Ejemplos:*\n.play colors yoko kanno\n.play https://youtu.be/HhJ-EWRMAJE`
    );
  }

  await m.react("🔎");

  const search = await yts(text);
  if (!search?.all?.length) {
    return m.reply(`❌ No encontré resultados para: *${text}*`);
  }

  const video = search.all[0];
  const title = video.title || "Audio Estelar 💙";

  const caption = `
╭── ❍⃟💙 𝙍𝙚𝙢 - 𝙋𝙡𝙖𝙮 💙 ❍⃟──
│ 🫧 *Título:* ${video.title}
│ 🫧 *Duración:* ${video.duration.timestamp}
│ 🫧 *Vistas:* ${video.views.toLocaleString()}
│ 🫧 *Autor:* ${video.author.name}
│ 🫧 *URL:* ${video.url}
╰───────────────💙`.trim();

  try {
    const thumbRes = await fetch(video.thumbnail);
    const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer());

    await conn.sendMessage(m.chat, {
      image: thumbBuffer,
      caption,
    }, { quoted: m });
  } catch (e) {
    console.error("⚠️ Error cargando miniatura:", e.message);
  }

  // 🔊 AUDIO
  if (command === "play") {
    try {
      await m.react("🎶");

      const apiUrl = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(text)}`;
      const res = await axios.get(apiUrl);
      const data = res.data.result;

      if (!data?.download?.url) throw new Error("No se pudo descargar el audio.");

      const audioUrl = data.download.url;
      const title = data.metadata.title || "Audio Estelar 💙";
      const thumbnail = data.metadata.thumbnail;
      const tmpPath = `${os.tmpdir()}/${title}.mp3`;

      const response = await axios({
        url: audioUrl,
        method: "GET",
        responseType: "stream"
      });

      const file = fs.createWriteStream(tmpPath);
      await streamPipeline(response.data, file);

      const doc = {
        audio: {
          url: tmpPath,
        },
        mimetype: "audio/mp4",
        fileName: title,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: data.metadata.url,
            title: title,
            sourceUrl: data.metadata.url,
            thumbnail: await (await conn.getFile(thumbnail)).data,
          }
        }
      };

      await conn.sendMessage(m.chat, doc, { quoted: m });
      await m.react("✅");

    } catch (err) {
      console.error(err);
      return m.reply("❌ Rem no pudo descargar el audio. Intenta más tarde.");
    }
  }

  // 🎬 VIDEO
  if (command === "play2" || command === "playvid") {
    try {
      await m.react("🎥");

      const res = await axios.get(`https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`);
      const data = res.data.result;

      if (!data?.download?.url) throw new Error("No se pudo obtener el video.");

      const head = await fetch(data.download.url, { method: "HEAD" });
      const size = parseInt(head.headers.get("content-length") || "0");
      const asDoc = (size / (1024 * 1024)) > SIZE_LIMIT_MB;

      await conn.sendMessage(m.chat, {
        video: { url: data.download.url },
        mimetype: "video/mp4",
        fileName: `${data.metadata.title}.mp4`,
        caption: "🎬 Aquí tienes tu video ~ 💙",
        ...(asDoc ? { asDocument: true } : {})
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      return m.reply("❌ Error al descargar el video.");
    }
  }
};

handler.help = ["play", "play2"];
handler.tags = ["descargas"];
handler.command = ["play", "play2", "playvid"];
handler.limit = true;

export default handler;
