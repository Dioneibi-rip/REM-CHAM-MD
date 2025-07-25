import axios from 'axios';

const isValidMediafireUrl = (url) => {
  return /^https?:\/\/(www\.)?mediafire\.com\/file\/.+$/.test(url);
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '💙';
  const loading = '⏳';
  const success = '✅';
  const errorEmoji = '❌';

  if (!args[0]) return m.reply(`${emoji} ᴘᴏʀ ғᴀᴠᴏʀ, ɪɴɢʀᴇsᴀ ᴜɴ ᴇɴʟᴀᴄᴇ ᴅᴇ *MediaFire*.\n\n*Ejemplo:* ${usedPrefix + command} https://www.mediafire.com/file/iojnikfucf67q74/Base_Bot_Simpel.zip/file`);

  if (!isValidMediafireUrl(args[0])) return m.reply(`${emoji} ᴇʟ ᴇɴʟᴀᴄᴇ ɴᴏ ᴇs ᴠᴀ́ʟɪᴅᴏ ᴅᴇ *MediaFire* 💙`);

  try {
    await m.react(loading);

    const apiUrl = `https://dark-core-api.vercel.app/api/download/mediafire?key=api&url=${encodeURIComponent(args[0])}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.url || !data?.filename) {
      throw new Error('⚠️ ʟᴀ ᴀᴘɪ ɴᴏ ᴅᴇᴠᴏʟᴠɪᴏ́ ᴜɴ ᴇɴʟᴀᴄᴇ ᴠᴀ́ʟɪᴅᴏ.');
    }

    await conn.sendMessage(m.chat, {
      document: { url: data.url },
      fileName: data.filename,
      mimetype: 'application/zip'
    }, { quoted: m });

    await m.react(success);

  } catch (err) {
    console.error(err);
    await m.react(errorEmoji);
    m.reply(`${errorEmoji} ᴏᴄᴜʀʀɪᴏ́ ᴜɴ ᴇʀʀᴏʀ:\n${err.message || err}`);
  }
};

handler.help = ['mediafire <url>'];
handler.tags = ['downloader'];
handler.command = ['mediafire', 'mf', 'mfdoc'];
handler.limit = 1;

export default handler;
