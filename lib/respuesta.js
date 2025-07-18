// --- VALORES NECESARIOS PARA LA NUEVA FUNCIONALIDAD ---
// Estos valores se han añadido para recrear la funcionalidad que pediste.
// Asegúrate de que las variables como 'redes' y 'miniaturaRandom' se adapten a tu bot.
const newsletterJid = '120363418071540900@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ 𝐄llen 𝐉ᴏᴇ\'s 𝐒ervice';
const packname = '˚🄴🄻🄻🄴🄽-🄹🄾🄴-🄱🄾🅃';

/**
 * Plugin centralizado para manejar todos los mensajes de error de permisos.
 * @param {string} type - El tipo de error (ej. 'admin', 'owner', 'unreg').
 * @param {object} conn - La conexión del bot.
 * @param {object} m - El objeto del mensaje.
 * @param {string} comando - El nombre del comando que se intentó usar.
 */
const handler = (type, conn, m, comando) => {
    // Objeto con todos los posibles mensajes de error.
    const msg = {
    owner: `* 𝙲𝙾𝙽𝚂𝚄𝙻𝚃𝙰 𝙳𝙴𝙻 𝙿𝚁𝙾𝙿𝙸𝙴𝚃𝙰𝚁𝙸𝙾*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚂𝙾𝙻𝙾 𝙿𝚄𝙴𝙳𝙴 𝚂𝙴𝚁 𝚄𝚂𝙰𝙳𝙾 𝙿𝙾𝚁 𝙴𝙻 𝙼𝙾𝙳𝙴𝚁𝙰𝙳𝙾𝚁 𝙳𝙴𝙻 𝙱𝙾𝚃 𝙾 𝙼𝙸 𝙲𝚁𝙴𝙰𝙳𝙾𝚁!`,
    moderator: `* 𝚂𝙾𝙻𝙾 𝙿𝙰𝚁𝙰 𝙼𝙾𝙳𝙴𝚁𝙰𝙳𝙾𝚁𝙴𝚂*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙴𝚂𝚃𝙰 𝙷𝙰𝙱𝙸𝙻𝙸𝚃𝙰𝙳𝙾 𝚂𝙾𝙻𝙾 𝙿𝙰𝚁𝙰 𝙻𝙾𝚂 𝙼𝙾𝙳𝙴𝚁𝙰𝙳𝙾𝚁𝙴𝚂 𝙳𝙴𝙻 𝙱𝙾𝚃!`,
    premium: ` 𝙿𝚁𝙴𝙼𝙸𝚄𝙼*\n
    ${userTag} 𝙳𝙴𝙱𝙴𝚂 𝚂𝙴𝚁 𝙿𝚁𝙴𝙼𝙸𝚄𝙼 𝙿𝙰𝚁𝙰 𝚄𝚂𝙰𝚁 𝙴𝚂𝚃𝙴 𝙲𝙾𝙼𝙰𝙽𝙳𝙾!`,
    group: `* 𝚂𝙾𝙻𝙾 𝙿𝙰𝚁𝙰 𝙶𝚁𝚄𝙿𝙾𝚂*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚂𝙾𝙻𝙾 𝙿𝚄𝙴𝙳𝙴 𝚂𝙴𝚁 𝚄𝚃𝙸𝙻𝙸𝚉𝙰𝙳𝙾 𝙴𝙽 𝙲𝙷𝙰𝚃𝚂 𝙳𝙴 𝙶𝚁𝚄𝙿𝙾𝚂!`,
    private: ` 𝙿𝚁𝙸𝚅𝙰𝙳𝙾*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚂𝙾𝙻𝙾 𝙳𝙴𝙱𝙴 𝚂𝙴𝚁 𝚄𝚃𝙸𝙻𝙸𝚉𝙰𝙳𝙾 𝙴𝙽 𝙿𝚁𝙸𝚅𝙰𝙳𝙾!`,
    admin: `* 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙳𝙴𝙱𝙴 𝚂𝙴𝚁 𝚄𝚂𝙰𝙳𝙾 𝙿𝙾𝚁 𝙰𝙳𝙼𝙸𝙽𝙸𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂!`,
    botAdmin: `* 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽*\n
    ${userTag} 𝚂𝙾𝙻𝙾 𝙴𝙻 𝙰𝙳𝙼𝙸𝙽𝙸𝚃𝚁𝙰𝙳𝙾𝚁 𝙳𝙴𝙻 𝙱𝙾𝚃 𝙿𝚄𝙴𝙳𝙴𝙽 𝚄𝚂𝙰𝚁 𝙳𝙸𝙲𝙷𝙾 𝙿𝙻𝚄𝙶𝙸𝙽!`,
    unreg: `* 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾 𝙽𝙴𝙲𝙴𝚂𝙰𝚁𝙸𝙾*\n
    ${userTag} 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝚃𝙴 𝙳𝙴 𝙴𝚂𝚃𝙰 𝙼𝙰𝙽𝙴𝚁𝙰 :𝟹:\n\n*#register name.age*\n\n𝙴𝙹𝙴𝙼𝙿𝙻𝙾: *#register ${m.name}.18*!`,
    nsfw: `* 𝙽𝚂𝙵𝚆*\n
    ${userTag} 𝙽𝚂𝙵𝚆 𝙽𝙾 𝙴𝚂𝚃𝙰 𝙿𝙴𝚁𝙼𝙸𝚃𝙸𝙳𝙾 𝙴𝙽 𝙴𝙻 𝙶𝚁𝚄𝙿𝙾 𝚂𝙸 𝙴𝚁𝙴𝚂 𝙰𝙳𝙼𝙸𝙽 𝙰𝙲𝚃𝙸𝚅𝙰𝙻𝙾!`,
    restrict: `* 𝙲𝚘𝚗𝚜𝚞𝚕𝚝𝚊 𝚍𝚎 𝚏𝚞𝚗𝚌𝚒ó𝚗 𝚒𝚗𝚊𝚌𝚝𝚒𝚟𝚊*\n
    ${userTag} 𝙴𝚜𝚝𝚊 𝚌𝚊𝚛𝚊𝚌𝚝𝚎𝚛í𝚜𝚝𝚒𝚌𝚊 𝚎𝚜𝚝á 𝚍𝚎𝚜𝚑𝚊𝚋𝚒𝚕𝚒𝚝𝚊𝚍𝚊!`,
    }[type];

    // Si se encontró un mensaje para el 'type' dado, se envía.
    if (msg) {
        // --- CONSTRUCCIÓN DEL CONTEXTINFO ---
        // Aquí se crea el objeto con la apariencia de reenviado de canal y el anuncio externo.
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
                body: '🦈 ¡Acceso Denegado! 🦈',
                thumbnailUrl: icono,
                sourceUrl: 'hola',
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        // Se envía el mensaje de error utilizando el contextInfo creado.
        return conn.reply(m.chat, msg, m, { contextInfo }).then(_ => m.react('✖️'));
    }
    return true; // Devuelve true si no hay mensaje, para seguir el flujo si es necesario.
};

// Exportamos la función para poder importarla desde handler.js
export default handler;