import axios from 'axios';

const isValidYouTubeUrl = (url) => {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '💙';
  const loading = '⏳';
  const success = '✅';
  const errorEmoji = '❌';

  if (!args[0]) return m.reply(`${emoji} ᴘᴏʀ ғᴀᴠᴏʀ, ɪɴɢʀᴇsᴀ ᴜɴ ᴇɴʟᴀᴄᴇ ᴅᴇ *YᴏᴜTᴜʙᴇ*.\n\n*Ejemplo:* ${usedPrefix + command} https://youtube.com/watch?v=dQw4w9WgXcQ`);

  if (!isValidYouTubeUrl(args[0])) return m.reply(`${emoji} ᴇʟ ᴇɴʟᴀᴄᴇ ɴᴏ ᴘᴀʀᴇᴄᴇ sᴇʀ ᴠᴀ́ʟɪᴅᴏ ᴅᴇ YᴏᴜTᴜʙᴇ 💙`);

  try {
    await m.react(loading);

    const apiURL = `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(args[0])}`;
    const { data } = await axios.get(apiURL);

    if (!data.result?.download?.url || !data.result?.metadata?.title) {
      throw new Error('❌ No se encontró el enlace de descarga en la respuesta de la API.');
    }

    const { url: downloadUrl, filename } = data.result.download;
    const title = data.result.metadata.title;

    await conn.sendMessage(m.chat, {
      video: { url: downloadUrl },
      mimetype: 'video/mp4',
      fileName: filename || `${title}.mp4`
    }, { quoted: m });

    await m.react(success);

  } catch (err) {
    console.error(err);
    await m.react(errorEmoji);
    m.reply(`❌ ᴏᴄᴜʀʀɪᴏ́ ᴜɴ ᴇʀʀᴏʀ:\n${err.message || err}`);
  }
};

handler.help = ['ytmp4 <url>'];
handler.tags = ['downloader'];
handler.command = ['ytmp4'];
handler.limit = 1;

export default handler;
