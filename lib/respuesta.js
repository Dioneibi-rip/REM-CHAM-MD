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
  'https://qu.ax/SXPJd.jpg',
];

// Función para obtener una aleatoria
const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)];

/**
 * Plugin centralizado para manejar todos los mensajes de error de permisos.
 */
const handler = (type, conn, m, comando) => {
  const msg = {
    rowner: '「💙」 *Esta función está reservada para mi creador Rem~ 💫*\n\n> Solo quien me dio vida puede usarla.',
    owner: '「💙」 *Solo mi dueño tiene permiso para ejecutar esto.*',
    mods: '「🧸」 *Comando exclusivo para los ayudantes de Rem.*',
    premium: '「🔹」 *Acceso solo para usuarios Premium con poderes especiales.*',
    group: '「👥」 *ᴇsᴛᴀ ғᴜɴᴄɪᴏ́ɴ sᴏ́ʟᴏ ғᴜɴᴄɪᴏɴᴀ ᴇɴ ɢʀᴜᴘᴏs, ¡ɪɴᴠɪᴛᴀᴍᴇ ᴀ ᴜɴᴏ!*',
    private: '「📩」 *Usa este comando en privado conmigo, porfis 💙.*',
    admin: '「🎀」 *Solo los administradores del grupo pueden usar este comando.*',
    botAdmin: '「🔐」 *Necesito ser admin para hacer eso... ¿me ayudas?*',
    unreg: '「💭」 *No estás registrado aún, Rem no te reconoce...*\n\n✧ Usa: */reg tu_nombre.edad*\n✧ Ejemplo: */reg rembot.15*',
    nsfw: '「🚫」 *El contenido NSFW está desactivado para proteger tu kokoro 💙.*',
    restrict: '「🕊️」 *Esta opción está limitada por mi creador.*\n> Contacta con él si deseas activarla.'
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
