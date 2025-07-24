import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, `❌ *Ingresa un enlace de Twitter para descargar*.\n\nEjemplo:\n${usedPrefix + command} https://twitter.com/9GAG/status/1661175429859012608`, m);

  try {
    const url = args[0];
    const response = await axios.get(`https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(url)}`);
    const res = response.data;

    if (!res.status) return conn.reply(m.chat, '⚠️ No se pudo descargar el video, verifica el enlace.', m);

    const { imgUrl, downloadLink, videoTitle, videoDescription } = res.data;

    // Mensaje decorado
    const caption = `
╭─❏ *🐦 𝗧𝗪𝗜𝗧𝗧𝗘𝗥 𝗗𝗟 𝗕𝗢𝗧 🐦*
│
│ *𝑻𝒊𝒕𝒖𝒍𝒐:* ${videoTitle || 'Desconocido'}
│ *𝑫𝒆𝒔𝒄𝒓𝒊𝒑𝒄𝒊ó𝒏:* ${videoDescription || 'Sin descripción'}
│
╰─────❏

*🔗 Enlace de descarga:* [Aquí](${downloadLink})
`;

    // Envía video con miniatura y caption
    await conn.sendMessage(m.chat, {
      video: { url: downloadLink },
      caption,
      jpegThumbnail: Buffer.from(await (await axios.get(imgUrl, { responseType: 'arraybuffer' })).data),
      mimetype: 'video/mp4',
      fileName: `twitter-video.mp4`
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Hubo un error al descargar el video de Twitter, intenta nuevamente.', m);
  }
};

handler.help = ['twitter <url>'];
handler.tags = ['downloader'];
handler.command = ['twitter', 'tw', 'twtdl'];

export default handler;
