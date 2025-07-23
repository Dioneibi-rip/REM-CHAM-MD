import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) throw `✳️ Ingresa un link de Google Drive\n\n✔️ Ejemplo :\n*${usedPrefix + command}* https://drive.google.com/file`;

  m.react(rwait);

  try {
    let res = await axios.get(`https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(args[0])}`);
    let result = res.data;

    if (!result.status || !result.data || !result.data.download) {
      throw new Error('No se pudo obtener el archivo');
    }

    const { name, download } = result.data;

    await m.reply(`
≡ *Google Drive DL*

▢ *Number:* ${name}
▢ *Size:* Desconocido
▢ *type:* Desconocido`);

    await conn.sendMessage(m.chat, {
      document: { url: download },
      fileName: name,
      mimetype: 'application/octet-stream' // puedes cambiarlo si sabes el tipo
    }, { quoted: m });

    m.react(done);

  } catch {
    m.reply('Error: Checa bien el link o prueba con otro');
  }
};

handler.help = ['gdrive'];
handler.tags = ['downloader', 'premium'];
handler.command = ['gdrive'];

export default handler;
