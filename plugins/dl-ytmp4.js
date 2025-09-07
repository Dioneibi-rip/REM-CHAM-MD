import axios from 'axios';

const isValidYouTubeUrl = (url) => {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '💙';
  const loading = '⏳';
  const success = '✅';
  const errorEmoji = '❌';

  if (!args[0]) {
    return m.reply(
      `${emoji} ᴘᴏʀ ғᴀᴠᴏʀ, ɪɴɢʀᴇsᴀ ᴜɴ ᴇɴʟᴀᴄᴇ ᴅᴇ *YᴏᴜTᴜʙᴇ*.\n\n*Ejemplo:* ${usedPrefix + command} https://youtube.com/watch?v=dQw4w9WgXcQ`
    );
  }

  if (!isValidYouTubeUrl(args[0])) {
    return m.reply(`${emoji} ᴇʟ ᴇɴʟᴀᴄᴇ ɴᴏ ᴘᴀʀᴇᴄᴇ sᴇʀ ᴠᴀ́ʟɪᴅᴏ ᴅᴇ YᴏᴜTᴜʙᴇ 💙`);
  }

  try {
    await m.react(loading);

    const ytURL = encodeURIComponent(args[0]);
    const apiURL = `https://ruby-core.vercel.app/api/download/youtube/mp4?url=${ytURL}`;

    const { data } = await axios.get(apiURL);

    if (!data.status || !data.download?.url) {
      throw new Error('La API no devolvió un enlace válido de video.');
    }

    const title = data.metadata?.title || "video";
    const videoUrl = data.download.url;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`,
        caption: `🎬 *${title}*`
      },
      { quoted: m }
    );

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
