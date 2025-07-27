import { addExif } from '../lib/sticker.js';

let handler = async (m, { conn, args }) => {
  if (!m.quoted) throw '✋ ᴘᴏʀ ғᴀᴠᴏʀ, ʀᴇsᴘᴏɴᴅᴇ ᴀ ᴜɴ sᴛɪᴄᴋᴇʀ ᴘᴀʀᴀ ᴀɢʀᴇɢᴀʀ ᴍᴀʀᴄᴀ ᴅᴇ ᴀɢᴜᴀ.';

  const mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) throw '⚠️ ᴇsᴛᴏ ɴᴏ ᴇs ᴜɴ sᴛɪᴄᴋᴇʀ. ʀᴇsᴘᴏɴᴅᴇ ᴀ ᴜɴᴏ.';

  const stick = args.join(' ').split('|');
  const packname = stick[0]?.trim() || 'StickerBot';
  const author = stick[1]?.trim() || 'by Bot';

  try {
    const img = await m.quoted.download();
    if (!img) throw '❌ ɴᴏ sᴇ ᴘᴜᴅᴏ ᴅᴇsᴄᴀʀɢᴀʀ ᴇʟ sᴛɪᴄᴋᴇʀ.';

    const stiker = await addExif(img, packname, author);
    if (stiker) {
      await conn.sendFile(m.chat, stiker, 'wm.webp', '', m);
    } else {
      throw '❌ Ocurrió un error al generar el sticker.';
    }
  } catch (e) {
    console.error(e);
    throw '❌ Error al procesar el sticker. Asegúrate de responder a un sticker válido.';
  }
};

handler.help = ['take <paquete>|<autor>'];
handler.tags = ['sticker'];
handler.command = ['take', 'wm'];

export default handler;
