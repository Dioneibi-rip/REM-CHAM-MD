import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {
    return m.reply(`╭┈────「 *🎧 SPOTIFY* 」─
│✦ Ejemplo de uso:
│${usedPrefix + command} murder in my mind
╰───────────────────`);
  }

  try {
    m.react('🎵');

    // 1. Buscar canciones en la API de DorratZ
    const res = await fetch(`https://api.dorratz.com/spotifysearch?query=${encodeURIComponent(text)}`);
    const json = await res.json();
    const results = json.data;

    if (!json.status || !results || results.length === 0) throw 'No se encontró ninguna canción.';

    // 2. Seleccionar el primer resultado
    const song = results[0];

    const caption = `
╭───── 𓆩🎧𓆪 ─────
│🎶 *Título:* ${song.title}
│⏱️ *Duración:* ${song.duration}
│📈 *Popularidad:* ${song.popularity}
│🔗 *Spotify:* ${song.url}
╰───────────────────`.trim();

    // 3. Enviar mensaje con tarjeta enriquecida
    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        forwardingScore: 999999,
        isForwarded: true,
        externalAdReply: {
          title: song.title,
          body: 'Spotify Preview Player',
          thumbnailUrl: 'https://i.scdn.co/image/ab67616d00001e0289a8f5a97d278fba63fa3f82', // imagen genérica de Spotify
          mediaUrl: song.preview,
          mediaType: 2,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: song.url
        }
      }
    }, { quoted: m });

    // 4. Enviar preview de la canción como audio (no es descarga completa)
    await conn.sendMessage(m.chat, {
      audio: { url: song.preview },
      fileName: `${song.title}.mp3`,
      mimetype: 'audio/mpeg'
    }, { quoted: m });

    m.react('✅');

  } catch (e) {
    console.error(e);
    m.react('❌');
    m.reply('❌ Error al obtener la canción. Asegúrate de escribir bien el nombre.');
  }
};

handler.command = ['spotify', 'spotifysearch'];
export default handler;
