import axios from 'axios';
const baileys = (await import('@whiskeysockets/baileys')).default;
const { proto } = baileys;
const { generateWAMessageFromContent, generateWAMessageContent } = baileys;

let handler = async (message, { conn, text }) => {
  if (!text) {
    return conn.reply(message.chat, '📘 *¿Qué video de Facebook quieres descargar?*', message);
  }

  async function createVideoMessage(url) {
    const { videoMessage } = await generateWAMessageContent(
      { video: { url } },
      { upload: conn.waUploadToServer }
    );
    return videoMessage;
  }

  try {
    const res = await axios.get(`https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(text)}`);
    const data = res.data?.data;

    if (!data?.status || !data.hd_url) {
      return conn.reply(message.chat, '❌ *No se pudo descargar el video de Facebook.*', message);
    }

    const videoMessage = await createVideoMessage(data.hd_url);

    const card = {
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: null
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: `📘 𝚃𝚒𝚝𝚞𝚕𝚘: ${data.title || 'Sin título'}`
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: true,
        videoMessage
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: []
      })
    };

    const carouselMessage = proto.Message.InteractiveMessage.CarouselMessage.fromObject({
      cards: [card]
    });

    const responseMessage = generateWAMessageFromContent(
      message.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({ text: null }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: ' `𝙁 𝘼 𝘾 𝙀 𝘽 𝙊 𝙊 𝙆  𝘿 𝙊 𝙒 𝙉 𝙇 𝙊 𝘼 𝘿 𝙀 𝙍`'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: null,
                hasMediaAttachment: false
              }),
              carouselMessage
            })
          }
        }
      },
      { quoted: message }
    );

    await conn.relayMessage(message.chat, responseMessage.message, {
      messageId: responseMessage.key.id
    });

  } catch (error) {
    console.error(error);
    await conn.reply(message.chat, '❌ Error al descargar el video: ' + error.message, message);
  }
};

handler.help = ['facebookdl <url>'];
handler.tags = ['downloader'];
handler.command = ['facebook', 'fb', 'fbdl'];

export default handler;
