import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, `❌ *𝙊𝙡𝙖~ ¡𝙉𝙤 𝙫𝙞𝙨𝙩𝙚 𝙚𝙡 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙚 𝙈𝙚𝙙𝙞𝙖𝙁𝙞𝙧𝙚!*\n\n✧ 𝙐𝙨𝙖𝙧 𝙘𝙤𝙢𝙤 𝙚𝙣𝙩𝙧𝙖𝙙𝙖:\n${usedPrefix + command} https://www.mediafire.com/file/iojnikfucf67q74/Base_Bot_Simpel.zip/file`, m);

  try {
    await conn.sendReaction(m.chat, '⌛', m.key);

    let url = args[0];
    let response = await axios.get(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(url)}`);
    let res = response.data;

    if (!res.status) {
      await conn.sendReaction(m.chat, '❌', m.key);
      return conn.reply(m.chat, '⚠️ 𝙉𝙤 𝙥𝙪𝙙𝙞 𝙤𝙗𝙩𝙚𝙣𝙚𝙧 𝙚𝙡 𝙖𝙧𝙘𝙝𝙞𝙫𝙤, 𝙫𝙚𝙧𝙞𝙛𝙞𝙘𝙖 𝙚𝙡 𝙚𝙣𝙡𝙖𝙘𝙚, 𝙨𝙞𝙚𝙢𝙥𝙧𝙚 𝙧𝙚𝙜𝙧𝙚𝙨𝙖 𝙖 𝙞𝙣𝙩𝙚𝙣𝙩𝙖𝙧 ♡', m);
    }

    let data = res.data;

    let caption = `
╭─❏ ＊ﾟ・✧ 𝗠𝗲𝗱𝗶𝗮𝗙𝗶𝗿𝗲 𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮𝘀 ✧・ﾟ＊
│
│ 𓆩 📦 𝙉𝙤𝙢𝙗𝙧𝙚: ${data.fileName}
│ 𓆩 🗂️ 𝙏𝙞𝙥𝙤: ${data.fileType}
│ 𓆩 📅 𝙁𝙚𝙘𝙝𝙖: ${data.uploadDate}
│ 𓆩 💾 𝙏𝙖𝙢𝙖𝙣̃𝙤: ${data.fileSize}
│ 𓆩 🖇️ 𝘾𝙤𝙢𝙥𝙖𝙩𝙞𝙗𝙞𝙡𝙞𝙙𝙖𝙙: ${data.compatibility}
│
│ 𝙎𝙞𝙣𝙤𝙥𝙨𝙞𝙨: ${data.description}
╰─────❏

*༄ 𝙍𝙚𝙢 𝙖𝙦𝙪í 𝙩𝙚 𝙡𝙡𝙚𝙫𝙖 𝙙𝙚𝙡 𝙢𝙖𝙣𝙤 𝙖 𝙡𝙤𝙨 𝙖𝙧𝙘𝙝𝙞𝙫𝙤𝙨 𝙦𝙪𝙚 𝙣𝙚𝙘𝙚𝙨𝙞𝙩𝙖𝙨 ♡*

  ✧ 𝙃𝙖𝙯 𝙘𝙡𝙞𝙘 𝙖𝙪𝙣𝙦𝙪𝙚 𝙨𝙚𝙖 𝙥𝙤𝙧 𝙖𝙡𝙜𝙪𝙣𝙖 𝙧𝙖𝙯ó𝙣 𝙣𝙤 𝙨𝙚 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖 𝙙𝙚 𝙖𝙡𝙜𝙪𝙣 𝙡𝙖𝙙𝙤 𝙡𝙤𝙨 𝙖𝙧𝙘𝙝𝙞𝙫𝙤𝙨
  𝙥𝙪𝙚𝙙𝙚𝙨 𝙪𝙨𝙖𝙧 𝙚𝙨𝙩𝙚 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙞𝙧𝙚𝙘𝙩𝙤: 
  🔗 ${data.url}
`;

    await conn.sendMessage(m.chat, {
      document: { url: data.url },
      fileName: data.fileName,
      mimetype: data.mimeType || 'application/octet-stream',
      caption,
      jpegThumbnail: Buffer.from(await (await axios.get(data.image || 'https://static.mediafire.com/images/filetype/download/zip.jpg', { responseType: 'arraybuffer' })).data)
    }, { quoted: m });

    await conn.sendReaction(m.chat, '✅', m.key);

  } catch (e) {
    console.error(e);
    await conn.sendReaction(m.chat, '❌', m.key);
    conn.reply(m.chat, '❌ 𝙊𝙥𝙨𝙨~ 𝙍𝙚𝙢 𝙣𝙤 𝙥𝙪𝙙𝙤 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙖𝙧𝙘𝙝𝙞𝙫𝙤 𝙙𝙚 𝙈𝙚𝙙𝙞𝙖𝙁𝙞𝙧𝙚, 𝙥𝙧𝙪𝙚𝙗𝙖 𝙢á𝙨 𝙩𝙖𝙧𝙙𝙚  ♡', m);
  }
};

handler.help = ['mediafire <url>'];
handler.tags = ['downloader'];
handler.command = ['mediafire', 'mf', 'mfdown'];
handler.register = true;

export default handler;
