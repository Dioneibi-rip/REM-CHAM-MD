const handler = async (m, { conn, participants, command, text }) => {
  const kickTarget = m.mentionedJid?.[0];

  if (!kickTarget) {
    return m.reply(`🧷 𝙿𝚘𝚛 𝚏𝚊𝚟𝚘𝚛 𝚎𝚝𝚒𝚚𝚞𝚎𝚝𝚊 𝚊 𝚕𝚊 𝚙𝚎𝚛𝚜𝚘𝚗𝚊 𝚚𝚞𝚎 𝚚𝚞𝚒𝚎𝚛𝚊𝚜 𝚎𝚡𝚙𝚞𝚕𝚜𝚊𝚛
📌 *Ejemplo:* *@usuario*`);
  }

  const userToKick = participants.find(u => u.id === kickTarget);
  const sender = m.sender;
  const bot = conn.user.jid;

  if (!userToKick) {
    return m.reply(`⚠️ 𝙴𝚕 𝚞𝚜𝚞𝚊𝚛𝚒𝚘 𝚗𝚘 𝚎𝚜𝚝𝚊́ 𝚎𝚗 𝚎𝚕 𝚐𝚛𝚞𝚙𝚘.`);
  }

  if (kickTarget === sender) {
    return m.reply(`🚫 𝙽𝚘 𝚙𝚞𝚎𝚍𝚎𝚜 𝚎𝚡𝚙𝚞𝚕𝚜𝚊𝚛𝚝𝚎 𝚊 𝚝𝚒 𝚖𝚒𝚜𝚖𝚘.`);
  }

  if (kickTarget === bot) {
    return m.reply(`🙃 𝙽𝚘 𝚖𝚎 𝚟𝚘𝚢 𝚊 𝚎𝚡𝚙𝚞𝚕𝚜𝚊𝚛 𝚊 𝚖𝚒 𝚖𝚒𝚜𝚖𝚘.`);
  }

  if (userToKick.admin === 'superadmin' || userToKick.isSuperAdmin || userToKick.isCreator) {
    return m.reply(`👑 𝙽𝚘 𝚙𝚞𝚎𝚍𝚘 𝚎𝚡𝚙𝚞𝚕𝚜𝚊𝚛 𝚊𝚕 𝚌𝚛𝚎𝚊𝚍𝚘𝚛 𝚍𝚎𝚕 𝚐𝚛𝚞𝚙𝚘.`);
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [kickTarget], 'remove');
    await m.reply(`✅ 𝙴𝚕 𝚞𝚜𝚞𝚊𝚛𝚒𝚘 @${kickTarget.split('@')[0]} 𝚏𝚞𝚎 𝚎𝚡𝚙𝚞𝚕𝚜𝚊𝚍𝚘.`, null, {
      mentions: [kickTarget]
    });
  } catch (err) {
    console.error(err);
    return m.reply(`❌ 𝙷𝚞𝚋𝚘 𝚞𝚗 𝚎𝚛𝚛𝚘𝚛 𝚊𝚕 𝚎𝚡𝚙𝚞𝚕𝚜𝚊𝚛 𝚊 𝚕𝚊 𝚙𝚎𝚛𝚜𝚘𝚗𝚊.`);
  }
};

handler.help = ['kick @user', 'ban @user', 'expulsar @user'];
handler.tags = ['group'];
handler.command = ['kick', 'ban', 'expulsar', 'echar', 'fuera', 'sacar'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
