import { areJidsSameUser } from '@whiskeysockets/baileys';

let handler = async (m, { conn, participants, command, usedPrefix, args }) => {


  let target;
  if (m.mentionedJid?.length) {
    target = m.mentionedJid[0];
  } else if (m.quoted) {
    target = m.quoted.sender;
  } else {
    return m.reply(`✳️ ᴇsᴘᴇᴄɪꜰɪ́ᴄᴀ ᴀ ǫᴜɪᴇ́ɴ ǫᴜɪᴇʀᴇs ǫᴜɪᴛᴀʀʟᴇ ᴇʟ ᴀᴅᴍɪɴ.\n\n🧩 ᴇᴊᴇᴍᴘʟᴏ:\n${usedPrefix + command} @usuario`);
  }

  const targetData = participants.find(p => areJidsSameUser(p.id, target));

  if (!targetData) return m.reply('😵 ᴇʟ ᴜsᴜᴀʀɪᴏ ɴᴏ ᴇsᴛᴀ́ ᴇɴ ᴇʟ ɢʀᴜᴘᴏ.');
  if (!targetData.admin) return m.reply('❗ ᴇsᴇ ᴜsᴜᴀʀɪᴏ ɴᴏ ᴇs ᴀᴅᴍɪɴ.');

  if (targetData.admin === 'superadmin') {
    return m.reply('👑 ɴᴏ ᴘᴜᴇᴅᴏ ǫᴜɪᴛᴀʀ ᴇʟ ᴀᴅᴍɪɴ ᴀʟ ᴄʀᴇᴀᴅᴏʀ ᴅᴇʟ ɢʀᴜᴘᴏ.');
  }

  await conn.groupParticipantsUpdate(m.chat, [target], 'demote');

  m.reply(`✅ ᴘᴇʀᴍɪsᴏs ʀᴇᴛɪʀᴀᴅᴏs ᴀ:\n@${target.split('@')[0]}`, null, {
    mentions: [target]
  });
};

handler.command = /^(demote|quitaradmin|quitarpija)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
