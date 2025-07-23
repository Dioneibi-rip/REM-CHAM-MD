import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) throw `Ingresa el enlace de algún Track, Playlist o Álbum de Spotify.`; 
  let isSpotifyUrl = text.match(/^(https:\/\/open\.spotify\.com\/(album|track|playlist)\/[a-zA-Z0-9]+)/i);
  if (!isSpotifyUrl && !text) throw `Ingresa el enlace de algún Track, Playlist o Álbum de Spotify.`;
  let user = global.db.data.users[m.sender];
  await m.react('🕓');
  try {
    // Llama a la API de descarga de Spotify
    let apiUrl = `https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(text)}`;
    let apiRes = await fetch(apiUrl);
    let json = await apiRes.json();
    if (!json.status || !json.data || !json.data.download) throw 'No se pudo obtener la descarga.';

    // Descarga y envía portada
    let img = await fetch(json.data.image);
    let imgBuffer = Buffer.from(await img.arrayBuffer());
    let caption = `*°ᡣ𐭩 . ° 𝚂𝙿𝙾𝚃𝙸𝙵𝚈 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰*\n\n`
      + `        ‹𝟹  *Título* : ${json.data.title}\n`
      + `        ‹𝟹  *Artista* : ${json.data.artis}\n`
      + `        ‹𝟹  *Duración* : ${(json.data.durasi / 1000 / 60).toFixed(2)} min\n`
      + `        ‹𝟹  *Tipo* : ${json.data.type}\n`;

    await conn.sendFile(m.chat, imgBuffer, 'thumbnail.jpg', caption, m);

    // Descarga y envía el MP3
    await conn.sendFile(m.chat, json.data.download, `${json.data.title}.mp3`, null, m, false, { mimetype: 'audio/mpeg', asDocument: user.useDocument });
    await m.react('✅');
  } catch (e) {
    await m.react('✖️');
    return m.reply('Ocurrió un error al intentar descargar el contenido.');
  }
};

handler.tags = ['downloader'];
handler.help = ['spotify'];
handler.command = ['spotify'];
handler.register = true;
export default handler;