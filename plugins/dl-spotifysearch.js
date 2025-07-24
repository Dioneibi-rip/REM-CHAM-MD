import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `*💚 𝙸𝚗𝚐𝚛𝚎𝚜𝚊 𝚕𝚘 𝚚𝚞𝚎 𝚍𝚎𝚜𝚎𝚊𝚜 𝚋𝚞𝚜𝚌𝚊𝚛 𝚎𝚗 𝚂𝚙𝚘𝚝𝚒𝚏𝚢.*\n\nEjemplo:\n${usedPrefix + command} phonky town`, m);

  await m.react("💚");

  try {
    let res = await fetch(`https://api.dorratz.com/spotifysearch?query=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json.status || !json.data || json.data.length === 0) {
      await m.react("❌");
      return conn.reply(m.chat, "❌ No se encontraron resultados en Spotify.", m);
    }

    let track = json.data[0]; // Primer resultado relevante
    let { title, duration, popularity, preview, url } = track;

    let caption = `
╭─❏ *⛧ RESULTADO SPOTIFY 🎧*
│𖠁 *𝑻𝒊𝒕𝒖𝒍𝒐:* ${title}
│𖠁 *𝑫𝒖𝒓𝒂𝒄𝒊𝒐́𝒏:* ${duration}
│𖠁 *𝑷𝒐𝒑𝒖𝒍𝒂𝒓𝒊𝒅𝒂𝒅:* ${popularity}
│𖠁 *𝑬𝒏𝒍𝒂𝒄𝒆:* ${url}
╰─────────────❏`;

    await conn.sendMessage(m.chat, {
      text: caption.trim()
    }, { quoted: m });

    if (preview) {
      await conn.sendFile(m.chat, preview, `${title}.mp3`, null, m);
    } else {
      conn.reply(m.chat, '⚠️ Esta canción no tiene preview disponible para descargar.', m);
    }

  } catch (e) {
    console.error(e);
    await m.react("❌");
    m.reply('❌ Error al buscar en Spotify.');
  }
};

handler.command = /^spotify$/i;
export default handler;
