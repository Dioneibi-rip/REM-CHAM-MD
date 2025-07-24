import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) 
    return conn.reply(m.chat, `❌ *Por favor, ingresa un enlace válido de MediaFire para descargar.*\n\nEjemplo:\n${usedPrefix + command} https://www.mediafire.com/file/iojnikfucf67q74/Base_Bot_Simpel.zip/file`, m);

  try {
    // Reacción de espera
    await conn.sendReaction(m.chat, '⌛', m.key);

    const url = args[0];
    const response = await axios.get(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(url)}`);
    const res = response.data;

    if (!res.status) {
      await conn.sendReaction(m.chat, '❌', m.key);
      return conn.reply(m.chat, '⚠️ No se pudo descargar el archivo. Verifica el enlace e intenta de nuevo.', m);
    }

    const d = res.data;

    // Mensaje decorativo y brillante
    const caption = `
✨✨═══════════════✨✨
          📦 *MEDIAFIRE DESCARGAS* 📦
✨✨═══════════════✨✨

📁 *Nombre:* ${d.fileName}
📦 *Tipo:* ${d.fileType}
🗃️ *Extensión:* .${d.fileExtension}
💾 *Tamaño:* ${d.fileSize}
📅 *Subido:* ${d.uploadDate}
💡 *Compatibilidad:* ${d.compatibility}

🔎 *Descripción:*
${d.description}

🌐 *Enlace oficial:*
${d.url}

═══════════════
*¡Descarga segura y rápida!*
✨ Gracias por usar nuestro bot ✨
`;

    await conn.sendMessage(m.chat, {
      document: { url: d.url },
      fileName: d.fileName,
      mimetype: d.mimeType,
      caption
    }, { quoted: m });

    // Reacción de éxito
    await conn.sendReaction(m.chat, '✅', m.key);

  } catch (error) {
    console.error(error);
    await conn.sendReaction(m.chat, '❌', m.key);
    conn.reply(m.chat, '❌ Hubo un error al procesar la descarga de MediaFire, intenta nuevamente.', m);
  }
};

handler.help = ['mediafire <url>'];
handler.tags = ['downloader'];
handler.command = ['mediafire', 'mf'];

export default handler;
