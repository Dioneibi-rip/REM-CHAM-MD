// --- VALORES NECESARIOS PARA LA NUEVA FUNCIONALIDAD ---
const newsletterJid = '120363418071540900@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ 𝐄llen 𝐉ᴏᴇ\'s 𝐒ervice';
const packname = '⟶꯭̽🩵𝑹𝑬𝑴᪱͢⎯꯭̽𝑪𝑯𝑨𝑴ͥ⎯꯭̽𝑩𝑶𝑻ͫ⎯꯭̽𝑴𝑫―̥';

// Array de miniaturas
const iconos = [
  'https://qu.ax/RsvOR.jpg',
  'https://qu.ax/PtdyH.jpg',
  'https://qu.ax/UvXvG.jpg',
  'https://qu.ax/govcr.jpg',
  'https://qu.ax/oVdPe.jpg',
  'https://qu.ax/SXPJd.jpg',
];

// Función para obtener una aleatoria
const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

/**
 * Plugin centralizado para manejar todos los mensajes de error de permisos.
 */
const handler = (type, conn, m, comando) => {
  const msg = {
    owner: `* 𝙲𝙾𝙽𝚂𝚄𝙻𝚃𝙰 𝙳𝙴𝙻 𝙿𝚁𝙾𝙿𝙸𝙴𝚃𝙰𝚁𝙸𝙾*\n...`,
    moderator: `* 𝚂𝙾𝙻𝙾 𝙿𝙰𝚁𝙰 𝙼𝙾𝙳𝙴𝚁𝙰𝙳𝙾𝚁𝙴𝚂*\n...`,
    premium: `* 𝙿𝚁𝙴𝙼𝙸𝚄𝙼*\n...`,
    group: `* 𝚂𝙾𝙻𝙾 𝙿𝙰𝚁𝙰 𝙶𝚁𝚄𝙿𝙾𝚂*\n...`,
    private: `* 𝙿𝚁𝙸𝚅𝙰𝙳𝙾*\n...`,
    admin: `* 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂*\n...`,
    botAdmin: `* 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽*\n...`,
    unreg: `* 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾 𝙽𝙴𝙲𝙴𝚂𝙰𝚁𝙸𝙾*\n...`,
    nsfw: `* 𝙽𝚂𝙵𝚆*\n...`,
    restrict: `* 𝙲𝚘𝚗𝚜𝚞𝚕𝚝𝚊 𝚍𝚎 𝚏𝚞𝚗𝚌𝚒ó𝚗 𝚒𝚗𝚊𝚌𝚝𝚒𝚟𝚊*\n...`,
  }[type];

  if (msg) {
    const contextInfo = {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      forwardedNewsletterMessageInfo: {
        newsletterJid,
        newsletterName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: packname,
        body: '꒰🧺 ʙɪᴇɴᴠᴇɴɪᴅᴏ ᴀʟ sᴜ́ᴘᴇʀ ʙᴏᴛ de ᴡʜᴀᴛsᴀᴘᴘ ꒱',
        thumbnailUrl: getRandomIcono(), // ← aleatoria
        sourceUrl: 'https://github.com/Dioneibi-rip/REM-CHAM-MD',
        mediaType: 1,
        renderLargerThumbnail: false
      }
    };

    return conn.reply(m.chat, msg, m, { contextInfo }).then(_ => m.react('✖️'));
  }

  return true;
};

export default handler;
