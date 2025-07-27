import { addExif } from '../lib/sticker.js';

let handler = async (m, { conn, args }) => {
  if (!m.quoted) throw '📌 ʀᴇsᴘᴏɴᴅᴇ ᴀ ᴜɴ sᴛɪᴄᴋᴇʀ ᴘᴀʀᴀ ᴄᴀᴍʙɪᴀʀ ʟᴀ ᴍᴀʀᴄᴀ ᴅᴇ ᴀɢᴜᴀ.\n\n*Ejemplo:* .wm StickerPack|By Juanito';

  const mime = m.quoted.mimetype || '';
  if (!/webp/.test(mime)) throw '⚠️ ᴇʟ ᴍᴇɴsᴀᴊᴇ ʀᴇsᴘᴏɴᴅɪᴅᴏ ɴᴏ ᴇs ᴜɴ sᴛɪᴄᴋᴇʀ.';

  const stick = args.join(' ').split('|');
  const packname = stick[0]?.trim() || 'Stickers';
  const author = stick[1]?.trim() || 'Bot';

  try {
    await m.react('🕓');
    const buffer = await m.quoted.download();
    if (!buffer) throw '❌ ɴᴏ sᴇ ᴘᴜᴅᴏ ᴅᴇsᴄᴀʀɢᴀʀ ᴇʟ sᴛɪᴄᴋᴇʀ.';

    const sticker = await addExif(buffer, packname, author);
    if (!sticker) throw '❌ ʜᴜʙᴏ ᴜɴ ᴘʀᴏʙʟᴇᴍᴀ ᴀʟ ᴄʀᴇᴀʀ ᴇʟ sᴛɪᴄᴋᴇʀ.';

    await conn.sendFile(m.chat, sticker, 'wm.webp', '', m, false, { asSticker: true });
    await m.react('✅');
  } catch (err) {
    console.error(err);
    await m.react('❌');
    throw '⚠️ ᴇʀʀᴏʀ ᴀʟ ᴘʀᴏᴄᴇsᴀʀ ᴇʟ sᴛɪᴄᴋᴇʀ. ᴀsᴇɢᴜ́ʀᴀᴛᴇ ᴅᴇ ʀᴇsᴘᴏɴᴅᴇʀ ᴀ ᴜɴ sᴛɪᴄᴋᴇʀ ᴠᴀ́ʟɪᴅᴏ.';
  }
};

handler.help = ['wm <paquete>|<autor>'];
handler.tags = ['sticker'];
handler.command = ['wm', 'take'];

export default handler;
