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
      `💙 *Por favor, escribe el nombre de una canción o pega el enlace de YouTube.*\n\n*Ejemplos:*\n.play colors yoko kanno\n.play https://youtu.be/HhJ-EWRMAJE`
    );
  }

  await m.react("🔎");

  try {
    const search = await yts(text);
    if (!search?.all?.length) {
      return m.reply(`❌ No encontré resultados para: *${text}*`);
    }

    const video = search.all[0];
    const title = video.title || "Audio Estelar 💙";

    const caption = `
╭── ❍⃟💙 Rem - Play 💙 ❍⃟──
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

    if (command === "play") {
      try {
        await m.react("🎶");
        const apiUrl = `https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.result?.download?.url) throw new Error("No se pudo obtener el enlace del audio.");

        const audioUrl = data.result.download.url;
        const title = data.result.metadata.title || "Audio Estelar 💙";
        const thumbnail = data.result.metadata.thumbnail;

        const tmpPath = `${os.tmpdir()}/${title}.mp3`;
        const response = await axios({ url: audioUrl, method: "GET", responseType: "stream" });
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
              mediaUrl: video.url,
              title,
              sourceUrl: video.url,
              thumbnail: await (await conn.getFile(thumbnail)).data,
            }
          }
        };

        await conn.sendMessage(m.chat, doc, { quoted: m });
        await m.react("✅");

      } catch (err) {
        console.error(err);
        return m.reply(`❌ Error al descargar el audio:\n${err.message}`);
      }
    }

    if (command === "play2" || command === "playvid") {
      try {
        await m.react("🎥");
        const apiUrl = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`;
        const res = await axios.get(apiUrl);
        const json = res.data;

        if (!json.result?.download?.url) {
          return m.reply("❌ No se pudo obtener el video.");
        }

        const videoUrl = json.result.download.url;
        const head = await fetch(videoUrl, { method: "HEAD" });
        const size = parseInt(head.headers.get("content-length") || "0");
        const asDoc = (size / (1024 * 1024)) > SIZE_LIMIT_MB;

        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          fileName: `${video.title}.mp4`,
          caption: "🎬 Aquí tienes tu video ~ 💙",
          ...(asDoc ? { asDocument: true } : {})
        }, { quoted: m });

      } catch (err) {
        console.error(err);
        return m.reply(`❌ Error al descargar el video:\n${err.message}`);
      }
    }

  } catch (globalError) {
    console.error("🔴 Error general en .play:", globalError);
    return m.reply(`❌ Ocurrió un error inesperado:\n${globalError.message}`);
  }
};

handler.help = ["play", "play2"];
handler.tags = ["descargas"];
handler.command = ["play", "play2", "playvid"];
handler.limit = true;

export default handler;
