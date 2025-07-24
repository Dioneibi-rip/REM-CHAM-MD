import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`*🎧 𝗣𝗢𝗥 𝗙𝗔𝗩𝗢𝗥 𝗜𝗡𝗚𝗥𝗘𝗦𝗔 𝗘𝗟 𝗘𝗡𝗟𝗔𝗖𝗘 𝗗𝗘 𝗦𝗣𝗢𝗧𝗜𝗙𝗬*
> Ejemplo:
${usedPrefix + command} https://open.spotify.com/track/30SdJAyFsYxAMBfJmNNPqI`);
  }

  try {
    let url = args[0];
    let res = await fetch(`https://api.stellarwa.xyz/dow/spotify?url=${url}&apikey=stellar-o7UYR5SC`);
    let json = await res.json();

    if (!json.status) throw `⚠️ No se pudo obtener la canción. Verifica el enlace.`;

    let { artist, title, duration, image, download } = json.data;

    await conn.sendMessage(m.chat, {
      image: { url: image },
      caption:
`╭─❏ *⛧ DESCARGA - SPOTIFY 🎵*
│𖠁 *𝑻𝒊𝒕𝒖𝒍𝒐:* ${title}
│𖠁 *𝑨𝒓𝒕𝒊𝒔𝒕𝒂:* ${artist}
│𖠁 *𝑫𝒖𝒓𝒂𝒄𝒊𝒐́𝒏:* ${duration}
│𖠁 *𝑬𝒏𝒍𝒂𝒄𝒆:* ${url}
╰─────────────❏`,
    }, { quoted: m });

    await conn.sendFile(m.chat, download, `${title}.mp3`, null, m);
  } catch (e) {
    console.error(e);
    m.reply(`❌ Error al descargar la canción.`);
  }
};

handler.command = /^spotify$/i;
export default handler;
