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

    const ytURL = encodeURIComponent(args[0]);
    const apiURL = `https://api.stellarwa.xyz/dow/ytmp4?url=${ytURL}&apikey=stellar-o7UYR5SC`;

    const { data } = await axios.get(apiURL);

    if (!data.status || !data.data?.dl) {
      throw new Error('La API no devolvió un enlace válido de video.');
    }

    const { title, dl } = data.data;

    await conn.sendMessage(m.chat, {
      video: { url: dl },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
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
