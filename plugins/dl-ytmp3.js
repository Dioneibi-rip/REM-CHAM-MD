import axios from 'axios';

const isValidYouTubeUrl = (url) => {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '💙';
  const loading = '⏳';
  const successEmoji = '✅';
  const errorEmoji = '❌';

  if (!args[0]) {
    return m.reply(`${emoji} ᴘᴏʀ ғᴀᴠᴏʀ, ɪɴɢʀᴇsᴀ ᴜɴ ᴇɴʟᴀᴄᴇ ᴅᴇ *YᴏᴜTᴜʙᴇ*.\n\n*Ejemplo:* ${usedPrefix + command} https://youtube.com/watch?v=dQw4w9WgXcQ`);
  }

  if (!isValidYouTubeUrl(args[0])) {
    return m.reply(`${emoji} ᴇʟ ᴇɴʟᴀᴄᴇ ɴᴏ ᴘᴀʀᴇᴄᴇ sᴇʀ ᴠᴀ́ʟɪᴅᴏ ᴅᴇ YᴏᴜTᴜʙᴇ 💙`);
  }

  try {
    await m.react(loading);

    const ytURL = encodeURIComponent(args[0]);
    const apiURL = `https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${ytURL}`;

    const { data } = await axios.get(apiURL);

    if (!data.status || !data.download) {
      throw new Error('La API no devolvió un enlace de descarga válido.');
    }

    const videoUrl = args[0];
    const title = data.title || 'Audio de YouTube';

    const thumbnailUrl = 'https://files.catbox.moe/wdnz90.jpg';

    const thumbData = await (await conn.getFile(thumbnailUrl)).data;

    await conn.sendMessage(m.chat, {
      audio: { url: data.download },
      mimetype: 'audio/mp4',
      fileName: `${title}`,
      ptt: false,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 2,
          mediaUrl: videoUrl,
          title: title,
          sourceUrl: videoUrl,
          thumbnail: thumbData,
        },
      },
    }, { quoted: m });

    await m.react(successEmoji);

  } catch (err) {
    console.error(err);
    await m.react(errorEmoji);
    m.reply(`❌ ᴏᴄᴜʀʀɪᴏ́ ᴜɴ ᴇʀʀᴏʀ:\n${err.message || err}`);
  }
};

handler.help = ['ytptt <url>'];
handler.tags = ['downloader'];
handler.command = ['ytaudio', 'mp3', 'ytmp3'];
handler.limit = 1;

export default handler;
