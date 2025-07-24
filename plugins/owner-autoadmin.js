const handler = async (m, { conn, isAdmin, groupMetadata }) => {
  const emoji = '💙';
  const done = '✅';
  const error = '❌';
  const font = (text) => text.replace(/[A-Za-z]/g, c => {
    const base = c === c.toLowerCase() ? 0x1D00 : 0x1D00 - 0x20;
    return String.fromCodePoint(base + c.charCodeAt(0));
  });

  if (isAdmin) {
    return m.reply(`${emoji} ʏᴀ ᴇʀᴇs ᴀᴅᴍɪɴ, ɴᴏ ɴᴇᴄᴇsɪᴛᴀs ᴘᴇᴅɪʀʟᴏ`);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    await m.react(done);
    m.reply(`${emoji} ᴀʜᴏʀᴀ ᴇʀᴇs ᴀᴅᴍɪɴ ᴅᴇʟ ɢʀᴜᴘᴏ ᴊᴇғᴇᴄɪᴛᴏ`);
  } catch (err) {
    await m.react(error);
    m.reply(`${emoji} ᴏᴄᴜʀʀɪᴏ́ ᴜɴ ᴇʀʀᴏʀ ᴀʟ ɪɴᴛᴇɴᴛᴀʀ ᴘʀᴏᴍᴏᴄɪᴏɴᴀʀᴛᴇ, sᴏʀʀʏ`);
  }
};

handler.tags = ['owner'];
handler.help = ['autoadmin'];
handler.command = ['autoadmin'];
handler.rowner = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
