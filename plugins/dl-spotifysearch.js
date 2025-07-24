import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text) {
    return m.reply(`💙 *ᴘᴏʀғᴀᴠᴏʀ, ᴅᴇʙᴇ ɪɴɢʀᴇsᴀʀ ᴜɴ ᴛᴇ́ʀᴍɪɴᴏ ᴅᴇ ʙᴜ́sǫᴜᴇᴅᴀ*`);
  }

  try {
    m.react('🎵');

    const res = await fetch(`https://api.dorratz.com/spotifysearch?query=${encodeURIComponent(text)}`);
    const json = await res.json();
    const results = json.data;

    if (!json.status || !results || results.length === 0) throw 'No se encontró ninguna canción.';

    const song = results[0];

    const caption = `
╭─❏ *⛧ DESCARGA - SPOTIFY 🎵*
│🎶 *𝑻𝒊𝒕𝒖𝒍𝒐:* ${song.title}
│⏱️ *𝑫𝒖𝒓𝒂𝒄𝒊𝒐́𝒏:* ${song.duration}
│📈 *𝒑𝒐𝒑𝒖𝒍𝒂𝒓𝒊𝒅𝒂𝒅:* ${song.popularity}
│🔗 *𝑬𝒏𝒍𝒂𝒄𝒆:* ${song.url}
╰───────────────────`.trim();

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

handler.command = ['spotifysearch'];
export default handler;
