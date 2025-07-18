// --- VALORES NECESARIOS PARA LA NUEVA FUNCIONALIDAD ---
const newsletterJid = '120363418071540900@newsletter';
const newsletterName = 'ꉂ♡⃘᮫ֹ໋֢۪۟🍩ᮬ᪲𝠅̷̸᮫໋۪  ʀᴇᴍ⎯꯭̽ᴄʜᴀᴍ⎯꯭̽ᴍᴅ⎯꯭̽ᴄʜᴀɴɴᴇʟ⎯꯭̽ʙᴏᴛ 🌕꒱𖫱ᮬ𐨿᮫࣪꒱ 〬 ࣭';
const packname = '⟶꯭̽🩵𝑹𝑬𝑴᪱͢⎯꯭̽𝑪𝑯𝑨𝑴ͥ⎯꯭̽𝑩𝑶𝑻ͫ⎯꯭̽𝑴𝑫―̥';

// Array de miniaturas
const iconos = [
  'https://qu.ax/RsvOR.jpg',
  'https://qu.ax/PtdyH.jpg',
  'https://qu.ax/UvXvG.jpg',
  'https://qu.ax/govcr.jpg',
  'https://qu.ax/oVdPe.jpg',
  'https://qu.ax/yoser.jpg',
  'https://qu.ax/WkSZr.jpg',
  'https://qu.ax/niuKM.jpg',
  'https://qu.ax/RRhCC.jpg',
  'https://qu.ax/lsGai.jpg',
  'https://qu.ax/ZAENX.jpg',
  'https://qu.ax/nlFmD.jpg',
  'https://qu.ax/iEjXR.jpg',
  'https://qu.ax/JEtpX.jpg',
  'https://qu.ax/Senny.jpg',
  'https://qu.ax/xpSyn.jpg',
  'https://qu.ax/ycTkR.jpg',
  'https://qu.ax/Jegjx.jpg',
  'https://qu.ax/GDdVo.jpg',
  'https://qu.ax/orhPQ.jpg',
  'https://qu.ax/ffJuK.jpg',
  'https://qu.ax/kNtsO.jpg',
  'https://qu.ax/qUQXe.jpg',
  'https://qu.ax/eoJCK.jpg',
  'https://qu.ax/SXPJd.jpg',
  'https://qu.ax/fuOaB.jpg',
  'https://qu.ax/SXPJd.jpg',
  'https://qu.ax/SXPJd.jpg',
];

// Función para obtener una aleatoria
const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

/**
 * Plugin centralizado para manejar todos los mensajes de error de permisos.
 */
const handler = (type, conn, m, comando) => {
  const msg = {
    rowner: '「💙」 *ᴇsᴛᴀ ғᴜɴᴄɪᴏ́ɴ ᴇsᴛᴀ ʀᴇsᴇʀᴠᴀᴅᴀ ᴘᴀʀᴀ ᴍɪ ᴀᴄᴛᴜᴀʟ ᴅᴜᴇɴ̃ᴏ ᴅɪᴏɴᴇɪʙɪ~ 💫*\n\n> sᴏʟᴏ ǫᴜɪᴇɴ ᴍᴇ ᴅɪᴏ ᴠɪᴅᴀ ᴘᴜᴇᴅᴇ ᴜsᴀʀʟᴀ.',
    owner: '「💙」 *sᴏʟᴏ ᴍɪ ᴅᴜᴇɴ̃ᴏ ᴛɪᴇɴᴇ ᴘᴇʀᴍɪsᴏ ᴘᴀʀᴀ ᴇᴊᴇᴄᴜᴛᴀʀ ᴇsᴛᴏ.*',
    mods: '「🧸」 *ᴄᴏᴍᴀɴᴅᴏ ᴇxᴄʟᴜsɪᴠᴏ ᴘᴀʀᴀ ʟᴏs ᴀʏᴜᴅᴀɴᴛᴇs ᴅᴇ ʀᴇᴍ.*',
    premium: '「🔹」 *ᴀᴄᴄᴇsᴏ sᴏʟᴏ ᴘᴀʀᴀ ᴜsᴜᴀʀɪᴏs ᴘʀᴇᴍɪᴜᴍ ᴄᴏɴ ᴘᴏᴅᴇʀᴇs ᴇsᴘᴇᴄɪᴀʟᴇs.*',
    group: '「👥」 *ᴇsᴛᴀ ғᴜɴᴄɪᴏ́ɴ sᴏ́ʟᴏ ғᴜɴᴄɪᴏɴᴀ ᴇɴ ɢʀᴜᴘᴏs, ¡ɪɴᴠɪᴛᴀᴍᴇ ᴀ ᴜɴᴏ!*',
    private: '「📩」 *ᴜsᴀ ᴇsᴛᴇ ᴄᴏᴍᴀɴᴅᴏ ᴇɴ ᴘʀɪᴠᴀᴅᴏ ᴄᴏɴᴍɪɢᴏ, ᴘᴏʀғɪs 💙.*',
    admin: '「🎀」 *sᴏʟᴏ ʟᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴅᴇʟ ɢʀᴜᴘᴏ ᴘᴜᴇᴅᴇɴ ᴜsᴀʀ ᴇsᴛᴇ ᴄᴏᴍᴀɴᴅᴏ.*',
    botAdmin: '「🔐」 *ɴᴇᴄᴇsɪᴛᴏ sᴇʀ ᴀᴅᴍɪɴ ᴘᴀʀᴀ ʜᴀᴄᴇʀ ᴇsᴏ... ¿ᴍᴇ ᴀʏᴜᴅᴀs?*',
    unreg: '「💭」 *ɴᴏ ᴇsᴛᴀ́s ʀᴇɢɪsᴛʀᴀᴅᴏ ᴀᴜ́ɴ, ʀᴇᴍ ɴᴏ ᴛᴇ ʀᴇᴄᴏɴᴏᴄᴇ...*\n\n✧ Usa: */reg tu_nombre.edad*\n✧ Ejemplo: */reg rembot.15*',
    nsfw: '「🚫」 *ᴇʟ ᴄᴏɴᴛᴇɴɪᴅᴏ ɴsғᴡ ᴇsᴛᴀ́ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ ᴘᴀʀᴀ ᴘʀᴏᴛᴇɢᴇʀ ᴛᴜ ᴋᴏᴋᴏʀᴏ 💙.*',
    restrict: '「🕊️」 *ᴇsᴛᴀ ᴏᴘᴄɪᴏ́ɴ ᴇsᴛᴀ́ ʟɪᴍɪᴛᴀᴅᴀ ᴘᴏʀ ᴍɪ ᴄʀᴇᴀᴅᴏʀ.*\ɴ> ᴄᴏɴᴛᴀᴄᴛᴀ ᴄᴏɴ ᴇ́ʟ sɪ ᴅᴇsᴇᴀs ᴀᴄᴛɪᴠᴀʀʟᴀ.'
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
