import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const emoji = '💙';
  const loading = '⏳';
  const success = '✅';
  const error = '❌';

  if (!args[0]) return m.reply(`${emoji} ᴘᴏʀ ғᴀᴠᴏʀ, ɪɴɢʀᴇsᴀ ᴜɴ ᴇɴʟᴀᴄᴇ ᴠᴀ́ʟɪᴅᴏ ᴅᴇ *MediaFire*.\n\n*Ejemplo:* ${usedPrefix + command} https://www.mediafire.com/file/xxxxxx`);

  if (!args[0].includes('mediafire.com')) return m.reply(`${emoji} ᴇʟ ᴇɴʟᴀᴄᴇ ɴᴏ ᴘᴀʀᴇᴄᴇ sᴇʀ ᴅᴇ *MediaFire*.`);

  try {
    await m.react(loading);

    const res = await fetch(`https://dark-core-api.vercel.app/api/download/mediafire?key=api&url=${encodeURIComponent(args[0])}`);
    const data = await res.json();

    if (!data || !data.url || !data.filename) throw new Error('No se pudo obtener el enlace de descarga');

    let txt = `乂  *M E D I A F I R E  -  D O W N L O A D*\n\n`;
    txt += `        ✩  *Nombre* : ${data.filename}\n`;
    txt += `        ✩  *Tamaño* : ${data.size || 'Desconocido'}\n`;
    txt += `        ✩  *Enlace* : ${data.link}\n\n`;
    txt += `💙 *Espera un momento mientras envío el archivo...*`;

    const thumb = await fetch('https://i.ibb.co/wLQFn7q/logo-mediafire.jpg').then(v => v.buffer());

    await conn.sendFile(m.chat, thumb, 'mediafire.jpg', txt, m);
    await conn.sendMessage(m.chat, {
      document: { url: data.url },
      fileName: data.filename,
      mimetype: 'application/octet-stream'
    }, { quoted: m });

    await m.react(success);

  } catch (e) {
    console.error(e);
    await m.react(error);
    m.reply(`❌ ᴏᴄᴜʀʀɪᴏ́ ᴜɴ ᴇʀʀᴏʀ ᴀʟ ᴅᴇsᴄᴀʀɢᴀʀ ᴅᴇ *MediaFire*:\n${e.message}`);
  }
};

handler.help = ['mediafire <url>'];
handler.tags = ['downloader'];
handler.command = ['mediafire', 'mdfire', 'mf'];
handler.limit = 1;
handler.premium = true;

export default handler;
