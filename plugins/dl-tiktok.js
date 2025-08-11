import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat,
      ` 𝙿𝚘𝚛 𝚏𝚊𝚟𝚘𝚛, 𝚒𝚗𝚐𝚛𝚎𝚜𝚊 𝚞𝚗 𝚎𝚗𝚕𝚊𝚌𝚎 𝚍𝚎 𝚃𝚒𝚔𝚃𝚘𝚔.\n\n📌 *Ejemplo:* ${usedPrefix + command} https://vm.tiktok.com/...`,
      m
    );
  }

  try {
    await conn.reply(m.chat, `𝙴𝚜𝚙𝚎𝚛𝚎 𝚞𝚗 𝚖𝚘𝚖𝚎𝚗𝚝𝚘, 𝚘𝚋𝚝𝚎𝚗𝚒𝚎𝚗𝚍𝚘 𝚎𝚕 𝚟𝚒𝚍𝚎𝚘...`, m);

    const tiktokData = await tiktokdl(args[0]);
    const result = tiktokData?.data;

    if (!result?.play) {
      return conn.reply(m.chat, "❌ 𝙴𝚛𝚛𝚘𝚛: 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚍𝚘 𝚘𝚋𝚝𝚎𝚗𝚎𝚛 𝚎𝚕 𝚟𝚒𝚍𝚎𝚘.", m);
    }

    const caption = `
  *T I K T O K  -  D O W N L O A D*

\`${result.title || 'Sin título'}\`

01:43 ━━━━●───── 04:40
⇆ㅤ ◁ㅤ ❚❚ ㅤ▷ ㅤ ↻
               ılıılıılıılıılıılı
𝚅𝙾𝙻𝚄𝙼𝙴 : ▮▮▮▮▮▮▮▮▮▮

❐  *Autor* : ${result.author?.nickname || 'Desconocido'}
❐  *Duración* : ${result.duration || 0} segundos
❐  *Vistas* : ${result.play_count || 0}
❐  *Likes* : ${result.digg_count || 0}
❐  *Comentarios* : ${result.comment_count || 0}
❐  *Compartidos* : ${result.share_count || 0}
❐  *Publicado* : ${formatDate(result.create_time)}
❐  *Descargas* : ${result.download_count || 0}
`.trim();

    await conn.sendFile(m.chat, result.play, 'tiktok.mp4', caption, m);
    await m.react('✅');
  } catch (error) {
    console.error(error);
    return conn.reply(m.chat, `❌ 𝙴𝚛𝚛𝚘𝚛 𝚊𝚕 𝚍𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚛: ${error.message}`, m);
  }
};

handler.help = ['tiktok', 'tt'].map(v => v + ' *<link>*');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt', 'tiktokdl', 'ttdl'];
handler.group = true;
handler.register = true;
handler.coin = 2;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
  const api = `https://www.tikwm.com/api/?url=${url}&hd=1`;
  const res = await fetch(api);
  const json = await res.json();
  return json;
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });
}