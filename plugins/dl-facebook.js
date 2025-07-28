import fetch from 'node-fetch';

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) return m.reply(`🌐 𝐏𝐨𝐫 𝐟𝐚𝐯𝐨𝐫, 𝐢𝐧𝐠𝐫𝐞𝐬𝐚 𝐮𝐧 𝐞𝐧𝐥𝐚𝐜𝐞 𝐯𝐚𝐥𝐢𝐝𝐨 𝐝𝐞 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤.\n📌 𝐄𝐣𝐞𝐦𝐩𝐥𝐨: ${usedPrefix + command} https://www.facebook.com/watch/?v=123456789`);

  const url = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(text)}`;
  let res = await fetch(url);
  let json = await res.json();

  if (!json.data || !json.data.status) {
    return m.reply(`❌ 𝐍𝐨 𝐬𝐞 𝐩𝐮𝐝𝐨 𝐝𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐫 𝐞𝐥 𝐯𝐢𝐝𝐞𝐨.\n🔁 𝐕𝐮𝐞𝐥𝐯𝐞 𝐚 𝐢𝐧𝐭𝐞𝐧𝐭𝐚𝐫 𝐜𝐨𝐧 𝐮𝐧 𝐞𝐧𝐥𝐚𝐜𝐞 𝐯𝐚𝐥𝐢𝐝𝐨.`);
  }

  const { title, hd_url, sd_url } = json.data;

  const caption = `
╭───────⊷
│👑 *FACEBOOK VIDEO*
├──────────────────
│🎬 *Título:* ${title || 'Desconocido'}
│📥 *Calidad:* ${hd_url ? 'HD' : 'SD'}
│🌐 *Fuente:* facebook.com
│📎 *Enlace:* ${text}
╰───────⊷
> _🎞️ 𝐄𝐧𝐯𝐢𝐚𝐧𝐝𝐨 𝐞𝐥 𝐯𝐢𝐝𝐞𝐨, 𝐞𝐬𝐩𝐞𝐫𝐚 𝐮𝐧 𝐦𝐨𝐦𝐞𝐧𝐭𝐨..._
`.trim();

  await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

  const videoUrl = hd_url || sd_url;
  if (!videoUrl) return m.reply('❌ No se encontró un video válido para descargar.');

  await conn.sendFile(m.chat, videoUrl, 'facebook.mp4', null, m);
};

handler.command = /^facebook|fb$/i;
handler.help = ['facebook <url>'];
handler.tags = ['downloader'];

export default handler;
