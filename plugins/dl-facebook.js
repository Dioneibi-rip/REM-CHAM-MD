import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) return m.reply(`🌐 𝐏𝐨𝐫 𝐟𝐚𝐯𝐨𝐫, 𝐢𝐧𝐠𝐫𝐞𝐬𝐚 𝐮𝐧 𝐞𝐧𝐥𝐚𝐜𝐞 𝐯𝐚𝐥𝐢𝐝𝐨 𝐝𝐞 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤.\n📌 𝐄𝐣𝐞𝐦𝐩𝐥𝐨: ${usedPrefix + command} https://www.facebook.com/watch/?v=123456789`);

  try {
    const apiUrl = `https://ruby-core.vercel.app/api/download/facebook?url=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json?.status) {
      return m.reply(`❌ 𝐍𝐨 𝐬𝐞 𝐩𝐮𝐝𝐨 𝐝𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐫 𝐞𝐥 𝐯𝐢𝐝𝐞𝐨.\n🔁 𝐕𝐞𝐫𝐢𝐟𝐢𝐜𝐚 𝐪𝐮𝐞 𝐞𝐥 𝐞𝐧𝐥𝐚𝐜𝐞 𝐬𝐞𝐚 𝐯𝐚𝐥𝐢𝐝𝐨.`);
    }

    const { metadata, download } = json;
    const { title, description, siteName } = metadata;

    if (!download) return m.reply('❌ No se encontró un link válido de descarga.');

    const caption = `
╭───────⊷
│👑 *FACEBOOK VIDEO*
├──────────────────
│🎬 *Título:* ${title || 'Desconocido'}
│📝 *Descripción:* ${description ? description.substring(0, 200) + '...' : 'Sin descripción'}
│🌐 *Fuente:* ${siteName || 'Facebook'}
│📥 *Link Descarga:* ${download ? 'Disponible' : 'No encontrado'}
╰───────⊷
> _🎞️ 𝐄𝐧𝐯𝐢𝐚𝐧𝐝𝐨 𝐞𝐥 𝐯𝐢𝐝𝐞𝐨, 𝐞𝐬𝐩𝐞𝐫𝐚..._
`.trim();

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

    // Descargar buffer del video
    const videoRes = await fetch(download);
    const buffer = await videoRes.buffer();

    await conn.sendFile(m.chat, buffer, 'facebook.mp4', `🎥 *${title || 'Video'}*`, m);

  } catch (e) {
    console.error(e);
    return m.reply('⚠️ Ocurrió un error al procesar tu solicitud.');
  }
};

handler.command = /^facebook|fb$/i;
handler.help = ['facebook <url>'];
handler.tags = ['downloader'];

export default handler;
