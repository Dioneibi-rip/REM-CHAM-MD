import yts from "yt-search";
const limit = 100;
const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🌴 Ingresa el nombre de un video o una URL de YouTube.");
  m.react("🌱")
  let res = await yts(text);
  if (!res || !res.all || res.all.length === 0) {
    return m.reply("No se encontraron resultados para tu búsqueda.");
  }

  let video = res.all[0];
  let total = Number(video.duration.seconds) || 0;

  const cap = `
\`\`\`⊜─⌈ 📻 ◜YouTube Play◞ 📻 ⌋─⊜\`\`\`

≡ 🌿 \`Título\` : » ${video.title}
≡ 🌾 \`Author\` : » ${video.author.name}
≡ 🌱 \`Duración\` : » ${video.duration.timestamp}
≡ 🌴 \`Vistas\` : » ${video.views}
≡ ☘️ \`URL\`      : » ${video.url}

тнe вeѕт wнaтѕapp вy ι'м ғz
`;

  // Corregido: obtener el buffer del thumbnail correctamente
  const thumbRes = await fetch(video.thumbnail);
  const thumbBuffer = await thumbRes.buffer();
  await conn.sendFile(m.chat, thumbBuffer, "image.jpg", cap, m);

  if (command === "play") {
    try {
      const api = await (await fetch(`https://api.stellarwa.xyz/dow/ytmp3?url=${video.url}&apikey=stellar-o7UYR5SC`)).json();
      if (!api.status || !api.data || !api.data.dl) return m.reply("No se pudo obtener el audio.");
      await conn.sendFile(m.chat, api.data.dl, `${video.title}.mp3`, "", m);
      await m.react("✔️");
    } catch (error) {
      return m.reply(error.message);
    }
  } else if (command === "play2" || command === "playvid") {
    try {
      const api = await (await fetch(`https://api.stellarwa.xyz/dow/ytmp4?url=${video.url}&apikey=stellar-o7UYR5SC`)).json();
      if (!api.status || !api.data || !api.data.dl) return m.reply("No se pudo obtener el video.");
      const dl = api.data.dl;
      const resVid = await fetch(dl);
      const cont = resVid.headers.get('content-length');
      const bytes = parseInt(cont, 10);
      const sizemb = bytes / (1024 * 1024);
      const doc = sizemb >= limit;
      await conn.sendFile(m.chat, dl, `${video.title}.mp4`, "", m, null, { asDocument: doc, mimetype: "video/mp4" });
      await m.react("✔️");
    } catch (error) {
      return m.reply(error.message);
    }
  }
}
handler.help = ["play", "play2"];
handler.tags = ["download"];
handler.command = ["play", "play2", "playvid"];
export default handler;