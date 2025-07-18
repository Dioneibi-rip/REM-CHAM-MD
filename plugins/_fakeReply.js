import fetch from 'node-fetch';

let handler = m => m;

handler.all = async function (m) {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender;
    let pp = await this.profilePictureUrl(who, 'image').catch(_ => 'https://imgur.com/a/BEPxuQF');

    // Reenvío con enlace del Grupo
    global.rpl = {
        contextInfo: {
            externalAdReply: {
                mediaUrl: dygp,
                mediaType: 'VIDEO',
                description: 'soporte',
                title: packname,
                body: '𝚁𝙴𝙼-𝙱𝙾𝚃 𝙱𝚈 𝙲𝚄𝚁𝙸',
                thumbnailUrl: pp,
                sourceUrl: dygp
            }
        }
    };

    // Reenvío con enlace de Paypal
    global.rpyp = {
        contextInfo: {
            externalAdReply: {
                mediaUrl: dygp,
                mediaType: 'VIDEO',
                description: 'Donacion',
                title: 'YOUTUBE',
                body: '𝚁𝙴𝙼-𝙱𝙾𝚃 𝙱𝚈 𝙲𝚄𝚁𝙸',
                thumbnailUrl: pp,
                sourceUrl: fgyt
            }
        }
    };

    // Reenvío con enlace de YouTube
    global.rpyt = {
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                mediaUrl: fgyt,
                mediaType: 'VIDEO',
                description: 'Suscribete : ' + fgyt,
                title: 'YouTube',
                body: '𝚁𝙴𝙼-𝙱𝙾𝚃 𝙱𝚈 𝙲𝚄𝚁𝙸',
                thumbnailUrl: pp,
                sourceUrl: fgyt
            }
        }
    };

    // Reenvío con enlace del Canal
global.rcanal = {
  contextInfo: {
    isForwarded: false,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363263466636910@newsletter",
      serverMessageId: -1, // <- ESTO permite que se vea en todos los clientes
      newsletterName: 'vermeil Bot Channel 🚩',
    },
    externalAdReply: { 
      showAdAttribution: true,
      title: packname,
      body: '🍟 ¡Super Bot De WhatsApp!',
      mediaUrl: null,
      description: null,
      previewType: "PHOTO",
      thumbnailUrl: icono,
      sourceUrl: redes,
      mediaType: 1,
      renderLargerThumbnail: false
    },
  }
}


export default handler;
