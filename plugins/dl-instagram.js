import axios from 'axios';

let handler = async (m, { conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, 'Ingresa un enlace de Instagram', m);
  try {
    let response = await axios.get(`https://api.dorratz.com/igdl?url=${encodeURIComponent(args[0])}`);
    let result = response.data;

    if (!result || !result.data || result.data.length === 0) {
      return conn.reply(m.chat, 'No se pudo obtener el video, intenta nuevamente', m);
    }

    let videoLink = result.data[0].url;
    let thumbnail = result.data[0].thumbnail;

    await conn.sendMessage(m.chat, {
      video: { url: videoLink },
      caption: `🎬 ＴＩＴＵＬＯ: Descarga de Instagram\n👍 ʟɪᴋᴇꜱ: Desconocido\n💬 ᴄᴏᴍᴇɴᴛᴀʀɪᴏꜱ: Desconocido`,
      mimetype: 'video/mp4',
      fileName: 'igdl.mp4'
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    conn.reply(m.chat, 'Hubo un error al procesar el video, intenta nuevamente', m);
  }
}

handler.command = ['ig','instagram'];

export default handler;
