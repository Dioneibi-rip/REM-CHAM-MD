import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat,
      `💠 𝙿𝚘𝚛 𝚏𝚊𝚟𝚘𝚛, 𝚒𝚗𝚐𝚛𝚎𝚜𝚊 𝚞𝚗 𝚎𝚗𝚕𝚊𝚌𝚎 𝚍𝚎 𝚃𝚒𝚔𝚃𝚘𝚔.`,
      m
    );
  }

  try {
    await conn.reply(m.chat, `⏳ 𝙴𝚜𝚙𝚎𝚛𝚎 𝚞𝚗 𝚖𝚘𝚖𝚎𝚗𝚝𝚘...\n🎬 ᴏʙᴛᴇɴɪᴇɴᴅᴏ ᴇʟ ᴠɪᴅᴇᴏ ᴅᴇ ᴛɪᴋᴛᴏᴋ`, m);

    const tiktokData = await tiktokdl(args[0]);
    const result = tiktokData?.data;

    if (!result?.play) {
      return conn.reply(m.chat, "❌ 𝙴𝚛𝚛𝚘𝚛: 𝙽𝚘 𝚜𝚎 𝚙𝚞𝚍𝚘 𝚘𝚋𝚝𝚎𝚗𝚎𝚛 𝚎𝚕 𝚟𝚒𝚍𝚎𝚘.", m);
    }

    const caption = `
⪻ *T I K T O K* ⪼  🎵
⏜᷼͡︵⌢᷼︵⏜᷼⌢︵ ⋱ ⋮ ⋰ ︵⌢᷼⏜︵᷼⌢︵᷼͡⏜
│🎥 𝚃𝚒́𝚝𝚞𝚕𝚘:  ${result.title || '𝚂𝚒𝚗 𝚝𝚒́𝚝𝚞𝚕𝚘'}
│👤 𝙰𝚞𝚝𝚘𝚛:  ${result.author?.nickname || 'Desconocido'}
│🕒 𝙳𝚞𝚛𝚊𝚌𝚒𝚘́𝚗:  ${result.duration || 0} segundos
│👁 𝚅𝚒𝚜𝚝𝚊𝚜:  ${result.play_count || 0}
│❤️ 𝙻𝚒𝚔𝚎𝚜:  ${result.digg_count || 0}
│💬 𝙲𝚘𝚖𝚎𝚗𝚝𝚊𝚛𝚒𝚘𝚜:  ${result.comment_count || 0}
│🔁 𝙲𝚘𝚖𝚙𝚊𝚛𝚝𝚒𝚍𝚘𝚜:  ${result.share_count || 0}
│📅 𝙵𝚎𝚌𝚑𝚊:  ${formatDate(result.create_time)}
│⬇️ 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚜:  ${result.download_count || 0}
⏝᷼͡︵⌢᷼︵⏝᷼⌢︵ ⋰ ⋮ ⋱ ︵⌢᷼⏝︵᷼⌢︵᷼͡⏝

 ━━━━●────────── 04:40
⇆ㅤ ◁ㅤ ❚❚ ㅤ▷ ㅤ ↻
               ılıılıılıılıılıılı
𝚅𝙾𝙻𝚄𝙼𝙴 : ▮▮▮▮▮▮▮▮▮▮
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
