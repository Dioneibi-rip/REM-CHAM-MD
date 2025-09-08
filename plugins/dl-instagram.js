import axios from 'axios';

let handler = async (m, { conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, 'Ingresa un enlace de Instagram', m);

  try {
    let response = await axios.get(`https://ruby-core.vercel.app/api/download/instagram?url=${encodeURIComponent(args[0])}`);
    let result = response.data;

    if (!result || !result.video || result.video.length === 0) {
      return conn.reply(m.chat, 'No se pudo obtener el video, intenta nuevamente', m);
    }

    let videoLink = result.video[0].url;
    let thumbnail = result.video[0].thumbnail;

    await conn.sendMessage(m.chat, {
      video: { url: videoLink },
      caption: `🎬 ᴀǫᴜɪ́ ᴛɪᴇɴᴇs sᴜ ᴅᴇsᴄᴀʀɢᴀ ᴅᴇ ɪɴsᴛᴀɢʀᴀᴍ (⁎˃ᴗ˂⁎)`,
      mimetype: 'video/mp4',
      fileName: 'instagram.mp4',
      jpegThumbnail: thumbnail ? await (await axios.get(thumbnail, { responseType: 'arraybuffer' })).data : null
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    conn.reply(m.chat, 'Hubo un error al procesar el video, intenta nuevamente', m);
  }
};

handler.command = ['ig','instagram'];

export default handler;
