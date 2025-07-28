import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) return m.reply(`🌐 Por favor, ingresa un enlace válido de Facebook.\nEjemplo: ${usedPrefix + command} https://www.facebook.com/watch/?v=123456789`);

  try {
    const url = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json.data || !json.data.status) {
      return m.reply(`❌ No se pudo descargar el video.\n🔁 Vuelve a intentar con un enlace válido.`);
    }

    const { title, hd_url, sd_url } = json.data;
    const videoUrl = hd_url || sd_url;
    if (!videoUrl) return m.reply('❌ No se encontró un video válido para descargar.');

    const caption = `
╭───────⊷
│👑 *FACEBOOK VIDEO*
├──────────────────
│🎬 *Título:* ${title || 'Desconocido'}
│📥 *Calidad:* ${hd_url ? 'HD' : 'SD'}
│🌐 *Fuente:* facebook.com
│📎 *Enlace:* ${text}
╰───────⊷
> _🎞️ Enviando el video, espera un momento..._
`.trim();

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

    // Descargar el video temporalmente
    const responseVideo = await fetch(videoUrl);
    if (!responseVideo.ok) {
      return m.reply('❌ Error descargando el video desde la URL.');
    }

    // Guarda el video en una ruta temporal
    const tempFilePath = path.join('/tmp', `fbvideo_${Date.now()}.mp4`);
    const fileStream = fs.createWriteStream(tempFilePath);
    await new Promise((resolve, reject) => {
      responseVideo.body.pipe(fileStream);
      responseVideo.body.on('error', reject);
      fileStream.on('finish', resolve);
    });

    // Envía el archivo guardado
    await conn.sendFile(m.chat, tempFilePath, 'facebook.mp4', null, m);

    // Borra el archivo temporal después de enviar
    fs.unlink(tempFilePath, err => {
      if (err) console.error('Error eliminando archivo temporal:', err);
    });

  } catch (error) {
    console.error(error);
    return m.reply('❌ Ocurrió un error inesperado al procesar la descarga.');
  }
};

handler.command = /^facebook|fb$/i;
handler.help = ['facebook <url>'];
handler.tags = ['downloader'];

export default handler;
