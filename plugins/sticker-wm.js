import { addExif } from '../lib/sticker.js';

let handler = async (m, { conn, args }) => {
  if (!m.quoted) throw '🚫 *Responde a un sticker para añadir marca de agua.*';

  const stickerInfo = args.join(" ").split("|");
  const packname = stickerInfo[0] || 'Sticker';
  const author = stickerInfo[1] || 'Bot';

  try {
    const mime = m.quoted.mimetype || '';
    if (!/webp/.test(mime)) throw '📌 *El mensaje respondido no es un sticker válido.*';

    const media = await m.quoted.download();
    if (!media) throw '⚠️ *No se pudo descargar el sticker.*';

    const sticker = await addExif(media, packname, author);
    if (sticker) {
      await conn.sendFile(m.chat, sticker, 'sticker.webp', '', m); // eliminado rpl
    } else {
      throw '❌ *La conversión del sticker falló.*';
    }
  } catch (e) {
    console.error(e);
    throw '❌ *Ocurrió un error al procesar el sticker.*';
  }
};

handler.help = ['take <packname>|<author>'];
handler.tags = ['sticker'];
handler.command = ['take', 'wm'];

export default handler;
