import yts from "yt-search";
const limit = 100;
const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("💙 *Escribe el nombre de una canción o pega un enlace de YouTube.*\n\n*Ejemplos:*\n.play colors yoko kanno\n.play https://youtu.be/HhJ-EWRMAJE");
  m.react("💠")
  let res = await yts(text);
  if (!res || !res.all || res.all.length === 0) {
    return m.reply("No se encontraron resultados para tu búsqueda.");
  }

  let video = res.all[0];

  const cap = `
╭── ❍⃟💙 𝙍𝙚𝙢 - 𝙋𝙡𝙖𝙮 💙 ❍⃟──
│ 🫧 *Título:* ${video.title}
│ 🫧 *Duración:* ${video.duration.timestamp}
│ 🫧 *Vistas:* ${video.views.toLocaleString()}
│ 🫧 *Autor:* ${video.author.name}
│ 🫧 *URL:* ${video.url}
╰───────────────💙
`;

  // Descargar y enviar el thumbnail correctamente
  try {
    const thumbRes = await fetch(video.thumbnail);
    const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer());
    await conn.sendFile(m.chat, thumbBuffer, "image.jpg", cap, m);
  } catch (e) {
    await m.reply("No se pudo cargar la miniatura.");
  }

  if (command === "play") {
    try {
      // Cambiada la API para audio
      const api = await (await fetch(`https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${encodeURIComponent(video.url)}`)).json();
      if (!api.status || !api.download) return m.reply("No se pudo obtener el audio.");
      await conn.sendFile(m.chat, api.download, `${api.title || video.title}.mp3`, "", m);
      await m.react("✔️");
    } catch (error) {
      return m.reply("❌ Error descargando audio: " + error.message);
    }
  } else if (command === "play2" || command === "playvid") {
    try {
      // API para video sigue siendo stellarwa.xyz
      const api = await (await fetch(`https://api.stellarwa.xyz/dow/ytmp4?url=${video.url}&apikey=stellar-o7UYR5SC`)).json();
      if (!api.status || !api.data || !api.data.dl) return m.reply("No se pudo obtener el video.");
      const dl = api.data.dl;
      const resVid = await fetch(dl, { method: "HEAD" });
      const cont = resVid.headers.get('content-length');
      const bytes = parseInt(cont || "0", 10);
      const sizemb = bytes / (1024 * 1024);
      const doc = sizemb >= limit;
      await conn.sendFile(m.chat, dl, `${video.title}.mp4`, "", m, null, { asDocument: doc, mimetype: "video/mp4" });
      await m.react("✔️");
    } catch (error) {
      return m.reply("❌ Error descargando video: " + error.message);
    }
  }
}
handler.help = ["play", "play2"];
handler.tags = ["download"];
handler.command = ["play", "play2", "playvid"];
export default handler;