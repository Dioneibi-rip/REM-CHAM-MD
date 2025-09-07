import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, `❌ *Ingresa un enlace de Twitter para descargar*.\n\nEjemplo:\n${usedPrefix + command} https://twitter.com/9GAG/status/1661175429859012608`, m);

  if (!conn.sendReaction) {
    conn.sendReaction = async (jid, emoji, key) => {
      return conn.sendMessage(jid, { react: { text: emoji, key } });
    };
  }

  try {
    await conn.sendReaction(m.chat, '⌛', m.key);

    const url = args[0];
    const response = await axios.get(`https://ruby-core.vercel.app/api/download/twitter?url=${encodeURIComponent(url)}`);
    const res = response.data;

    if (!res?.status) {
      await conn.sendReaction(m.chat, '❌', m.key);
      return conn.reply(m.chat, '⚠️ No se pudo descargar el video, verifica el enlace.', m);
    }

    const { metadata, downloads } = res;
    const { title, uploader, duration, thumbnail, like_count } = metadata;

    let video = downloads.find(v => v.resolution.includes("720")) || downloads[0];

    const caption = `
╭─❏ *🐦 𝗧𝗪𝗜𝗧𝗧𝗘𝗥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*
│
│ 🎬 *Título:* ${title || 'Desconocido'}
│ 👤 *Canal:* ${uploader || 'N/A'}
│ ⏱️ *Duración:* ${duration ? duration.toFixed(1) + "s" : 'N/A'}
│ ❤️ *Likes:* ${like_count || '0'}
│ 📹 *Calidad:* ${video.quality || 'Desconocida'}
│
╰─────❏
`.trim();

    const thumbBuffer = thumbnail
      ? Buffer.from(await (await axios.get(thumbnail, { responseType: 'arraybuffer' })).data)
      : null;

    await conn.sendMessage(m.chat, {
      video: { url: video.url },
      caption,
      jpegThumbnail: thumbBuffer,
      mimetype: 'video/mp4',
      fileName: `twitter-${video.quality || 'video'}.mp4`
    }, { quoted: m });

    await conn.sendReaction(m.chat, '✅', m.key);

  } catch (error) {
    console.error(error);
    await conn.sendReaction(m.chat, '❌', m.key);
    conn.reply(m.chat, '❌ Hubo un error al descargar el video de Twitter, intenta nuevamente.', m);
  }
};

handler.help = ['twitter <url>'];
handler.tags = ['downloader'];
handler.command = ['twitter', 'tw', 'twtdl'];

export default handler;
