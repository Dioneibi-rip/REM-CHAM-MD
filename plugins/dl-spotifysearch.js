import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`*𓆩🎶𓆪 𝗣𝗢𝗥 𝗙𝗔𝗩𝗢𝗥 𝗘𝗦𝗖𝗥𝗜𝗕𝗘 𝗘𝗟 𝗡𝗢𝗠𝗕𝗥𝗘 𝗗𝗘 𝗟𝗔 𝗖𝗔𝗡𝗖𝗜𝗢́𝗡 𝗢 𝗔𝗥𝗧𝗜𝗦𝗧𝗔*
> Ejemplo:
${usedPrefix + command} phonk`);
  }

  try {
    let query = args.join(' ');
    let res = await fetch(`https://api.dorratz.com/spotifysearch?query=${encodeURIComponent(query)}`);
    let json = await res.json();

    if (!json.status || !json.data.length) throw '*❌ 𝗡𝗢 𝗦𝗘 𝗘𝗡𝗖𝗢𝗡𝗧𝗥𝗔𝗥𝗢𝗡 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦*';

    for (let i = 0; i < Math.min(json.data.length, 5); i++) {
      let song = json.data[i];

      await conn.sendMessage(m.chat, {
        audio: { url: song.preview },
        mimetype: 'audio/mpeg',
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: song.title,
            body: `🕒 Duración: ${song.duration} | ❤️ Popularidad: ${song.popularity}`,
            thumbnailUrl: 'https://i.scdn.co/image/ab67616d0000b273b8ad5f4b3e14f50247341d2f', // Imagen genérica de Spotify
            sourceUrl: song.url,
            mediaType: 2,
            showAdAttribution: true
          }
        }
      }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    m.reply(`⚠️ 𝑶𝒐𝒉~ 𝒉𝒖𝒃𝒐 𝒖𝒏 𝒆𝒓𝒓𝒐𝒓 𝒂𝒍 𝒃𝒖𝒔𝒄𝒂𝒓 𝒍𝒂 𝒄𝒂𝒏𝒄𝒊𝒐́𝒏.\n\n${e}`);
  }
};

handler.command = /^spotifysearch$/i;
export default handler;
