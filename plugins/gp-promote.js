const handler = async (m, { conn, text, participants, isAdmin, isBotAdmin }) => {

  let user;

  if (m.mentionedJid && m.mentionedJid.length) {
    user = m.mentionedJid[0];
  } else if (m.quoted?.sender) {
    user = m.quoted.sender;
  } else {
    return conn.reply(m.chat, `🍃 ᥫ᭡ 𝖣𝖾𝖻𝖾𝗌 𝗆𝖾𝗇𝖼𝗂𝗈𝗇𝖺𝗋 𝖺 𝗎𝗇 𝗎𝗌𝗎𝖺𝗋𝗂𝗈 𝗈 𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝖾𝗋 𝖺 𝗌𝗎 𝗆𝖾𝗇𝗌𝖺𝗃𝖾.\n\n*𝗘𝗷𝗲𝗺𝗽𝗹𝗼:* .promote @usuario`, m);
  }

  const groupData = await conn.groupMetadata(m.chat);
  const isTargetAdmin = groupData.participants.find(p => p.id === user)?.admin;

  if (isTargetAdmin) {
    return conn.reply(m.chat, `👑 ᴇsᴇ ᴜsᴜᴀʀɪᴏ ʏᴀ ᴇs ᴀᴅᴍɪɴ.`, m);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    await conn.reply(m.chat, `✨ ᴇʟ ᴜsᴜᴀʀɪᴏ @${user.split('@')[0]} ᴀʜᴏʀᴀ ᴇs ᴀᴅᴍɪɴ 💙`, m, {
      mentions: [user]
    });
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ 𝖤𝗋𝗋𝗈𝗋 𝖺𝗅 𝗉𝗋𝗈𝗆𝗈𝗏𝖾𝗋 𝖺𝗅 𝗎𝗌𝗎𝖺𝗋𝗂𝗈.`, m);
  }
};

handler.help = ['promote'];
handler.tags = ['grupo'];
handler.command = ['promote', 'darpija', 'promover'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
