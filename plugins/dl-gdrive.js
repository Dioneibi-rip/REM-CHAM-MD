import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) throw `🔗 𝙄𝙣𝙜𝙧𝙚𝙨𝙖 𝙪𝙣 𝙡𝙞𝙣𝙠 𝙙𝙚 *Google Drive*\n\n📌 𝙀𝙟𝙚𝙢𝙥𝙡𝙤:\n*${usedPrefix + command}* https://drive.google.com/file/d/1234567890/view?usp=sharing`;

  m.react('🌀');

  try {
    let res = await axios.get(`https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(args[0])}`);
    let result = res.data;

    if (!result.status || !result.data || !result.data.download) {
      return m.reply('🚫 𝙀𝙧𝙧𝙤𝙧: 𝙉𝙤 𝙨𝙚 𝙥𝙪𝙙𝙤 𝙤𝙗𝙩𝙚𝙣𝙚𝙧 𝙚𝙡 𝙖𝙧𝙘𝙝𝙞𝙫𝙤. 𝙍𝙚𝙫𝙞𝙨𝙖 𝙚𝙡 𝙡𝙞𝙣𝙠.');
    }

    let { name, download } = result.data;

    await m.reply(`
╭───[ *📂 𝐆𝐨𝐨𝐠𝐥𝐞 𝐃𝐫𝐢𝐯𝐞 𝐃𝐋* ]
│▢ 𝙉𝙤𝙢𝙗𝙧𝙚: ${name}
│▢ 𝙏𝙞𝙥𝙤: 𝙉𝙤 𝙚𝙨𝙥𝙚𝙘𝙞𝙛𝙞𝙘𝙖𝙙𝙤
│▢ 𝙀𝙣𝙡𝙖𝙘𝙚: ✅ Descarga en curso...
╰───────────────⬣`);

    await conn.sendMessage(m.chat, {
      document: { url: download },
      fileName: name,
      mimetype: 'application/octet-stream'
    }, { quoted: m });

    m.react('✅');

  } catch (e) {
    console.error(e);
    m.reply('❌ 𝙀𝙧𝙧𝙤𝙧 𝙖𝙡 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧. 𝙋𝙧𝙪𝙚𝙗𝙖 𝙘𝙤𝙣 𝙤𝙩𝙧𝙤 𝙚𝙣𝙡𝙖𝙘𝙚.');
  }
};

handler.help = ['gdrive'];
handler.tags = ['downloader', 'premium'];
handler.command = ['gdrive'];
handler.credit = true;
handler.premium = true;

export default handler;
