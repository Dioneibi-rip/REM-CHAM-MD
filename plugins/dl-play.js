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
      `💙 *Escribe el nombre de una canción o pega un enlace de YouTube.*\n\n*Ejemplos:*\n.play colors yoko kanno\n.play https://youtu.be/HhJ-EWRMAJE`
    );
  }

  await m.react("🔎");

  const search = await yts(text);
  if (!search?.all?.length) {
    return m.reply(`❌ No encontré resultados para: *${text}*`);
  }

  const video = search.all[0];

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

      const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`;
      const res = await axios.get(apiUrl);
      const data = res.data?.result;

      if (!data?.download?.url) throw new Error("No se pudo obtener el enlace del audio");

      const audioUrl = data.download.url;
      const filename = data.download.filename || "audio.mp3";
      const title = data.metadata?.title || "Audio Estelar 💙";
      const thumbnail = data.metadata?.thumbnail;
      const tmpPath = `${os.tmpdir()}/${filename}`;

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
        fileName: filename,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            mediaType: 2,
            mediaUrl: video.url,
            title: title,
            sourceUrl: video.url,
            thumbnail: await (await conn.getFile(thumbnail)).data,
          }
        }
      };

      await conn.sendMessage(m.chat, doc, { quoted: m });
      await m.react("✅");

    } catch (err) {
      console.error("❌ Error al descargar el audio:", err);
      return m.reply("❌ Rem no pudo descargar el audio. Intenta más tarde.");
    }
  }

  // 📹 VIDEO
  if (command === "play2" || command === "playvid") {
    try {
      await m.react("📽️");

      const apiUrl = `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(video.url)}`;
      const res = await axios.get(apiUrl);
      const data = res.data?.result;

      if (!data?.download?.url) {
        return m.reply("❌ No se pudo obtener el video.");
      }

      const videoUrl = data.download.url;
      const filename = data.download.filename || "video.mp4";

      const head = await fetch(videoUrl, { method: "HEAD" });
      const size = parseInt(head.headers.get("content-length") || "0");
      const asDoc = (size / (1024 * 1024)) > SIZE_LIMIT_MB;

      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        fileName: filename,
        caption: "🎬 Aquí tienes tu video ~ 💙",
        ...(asDoc ? { asDocument: true } : {})
      }, { quoted: m });

      await m.react("✅");

    } catch (err) {
      console.error("❌ Error al descargar el video:", err);
      return m.reply("❌ Error al descargar el video.");
    }
  }
};

handler.help = ["play", "play2"];
handler.tags = ["descargas"];
handler.command = ["play", "play2", "playvid"];
handler.limit = true;

export default handler;