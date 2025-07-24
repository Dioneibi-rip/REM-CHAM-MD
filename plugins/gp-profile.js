import { createHash } from 'crypto';
import { canLevelUp, xpRange } from '../lib/levelling.js';
import axios from 'axios';

const imgUrl = 'https://i.pinimg.com/564x/2f/5f/4e/2f5f4e0bca776a01149d5af831ad295e.jpg';

let handler = async (m, { conn, usedPrefix, command }) => {
  const botname = "REM CHAM-MD 💙";

  if (typeof conn.profilePictureUrl !== 'function' || typeof conn.fetchStatus !== 'function') {
    return m.reply('⚠️ El bot no soporta esta función.');
  }

  let who = m.quoted?.sender || m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);

  if (!(who in global.db.data.users)) {
    return m.reply('✳️ 𝙴𝚕 𝚞𝚜𝚞𝚊𝚛𝚒𝚘 𝚗𝚘 𝚎𝚜𝚝𝚊́ 𝚎𝚗 𝚖𝚒 𝚋𝚊𝚜𝚎 𝚍𝚎 𝚍𝚊𝚝𝚘𝚜.');
  }

  let pp = await conn.profilePictureUrl(who, 'image').catch(() => './logo.jpg');
  let user = global.db.data.users[who];
  let about = (await conn.fetchStatus(who).catch(() => ({})))?.status || 'Sin biografía';
  let { name, exp, credit, registered, regTime, level, role, warn } = user;
  let { min, xp, max } = xpRange(level, global.multiplier);
  let username = conn.getName(who);
  let prem = global.prems.includes(who.split`@`[0]);
  let sn = createHash('md5').update(who).digest('hex');
  let math = max - xp;

  let levelProgress = Math.min(Math.floor((exp - min) / (max - min) * 20), 20);
  let progressBar = [...Array(20)].map((_, i) => i < levelProgress ? '▰' : '▱').join('');

  const profileMessage = `
👤 𝙿𝙴𝚁𝙵𝙸𝙻 𝙳𝙴 ${username}

📝 𝙽𝙾𝙼𝙱𝚁𝙴: ${name}
⭐ 𝚁𝙾𝙻: ${global.rpg.role(level)}
⚠️ 𝙰𝚍𝚟𝚎𝚛𝚝𝚎𝚗𝚌𝚒𝚊𝚜: ${warn}

🎖️ 𝙽𝙸𝚅𝙴𝙻: ${level}
🆙 𝙴𝚇𝙿: ${exp} / ${xp} (${math <= 0 ? 'ʟɪꜱᴛᴏ ᴘᴀʀᴀ ꜱᴜʙɪʀ ᴅᴇ ɴɪᴠᴇʟ' : `𝙵𝚊𝚕𝚝𝚊𝚗 ${math} 𝚇𝙿`})

💰 𝙲𝚁𝙴𝙳𝙸𝚃𝙾: ${credit}
🔒 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾: ${registered ? '𝚂𝙸' : '𝙽𝙾'}
🌟 𝙿𝚁𝙴𝙼𝙸𝚄𝙼: ${prem ? '𝚂𝙸' : '𝙽𝙾'}

📆 𝙵𝚎𝚌𝚑𝚊 𝚍𝚎 𝚛𝚎𝚐𝚒𝚜𝚝𝚛𝚘: ${regTime || 'N/A'}
🔗 𝙸𝙳: ${sn}

📝 𝙱𝙸𝙾𝙶𝚁𝙰𝙵𝙸𝙰:
${about}
`.trim();

  const decorated = `
╭────「 𝙿𝚎𝚛𝚏𝚒𝚕 𝚍𝚎 ${username} 」
│${profileMessage.split('\n').join('\n│')}
│
│ 𝙿𝚛𝚘𝚐𝚛𝚎𝚜𝚘 𝚍𝚎 𝚗𝚒𝚟𝚎𝚕:
│ [${progressBar}] (${levelProgress * 5}%)
│
│────────────────────
│ 𝚈𝙾 𝚂𝙾𝚈 𝚁𝙴𝙼 𝙲𝙷𝙰𝙼 :3
│ 𝚆𝚎𝚋: https://remcham-md.vercel.app
│ 𝙶𝚒𝚝𝙷𝚞𝚋: github.com/davidprospero123/REM-CHAM-MD
╰────────────────────
`.trim();

  const thumbnail = await axios.get(imgUrl, { responseType: 'arraybuffer' }).then(res => res.data).catch(() => null);

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: decorated,
    contextInfo: {
      forwardingScore: 9999,
      externalAdReply: {
        title: botname,
        body: null,
        sourceUrl: 'https://github.com/davidprospero123/REM-CHAM-MD',
        mediaType: 1,
        thumbnail
      }
    }
  }, { quoted: m });

  await m.react('✅');
};

handler.help = ['profile'];
handler.tags = ['group'];
handler.command = ['profile', 'perfil'];
handler.register = true;

export default handler;
