import axios from 'axios';
const baileys = (await import("@whiskeysockets/baileys")).default;
const { proto } = baileys;
const { generateWAMessageFromContent, generateWAMessageContent } = baileys;

let handler = async (message, { conn, text }) => {
    if (!text) {
        return conn.reply(message.chat, ' *¿Qué video de Facebook quieres descargar? :3*', message);
    }

    async function createVideoMessage(url) {
        const { videoMessage } = await generateWAMessageContent(
            { video: { url } },
            { upload: conn.waUploadToServer }
        );
        return videoMessage;
    }

    try {
        const { data: response } = await axios.get(`https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(text)}`);

        if (!response?.data?.status || !response.data?.hd_url) {
            return conn.reply(message.chat, ' *No se pudo descargar el video. :c*', message);
        }

        const url = response.data.hd_url;
        const videoMessage = await createVideoMessage(url);

        const cards = [
            {
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: null }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: '🎥 Video descargado con éxito'
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    hasMediaAttachment: true,
                    videoMessage
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: []
                })
            }
        ];

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
                            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                cards
                            })
                        })
                    }
                }
            },
            { quoted: message }
        );

        await conn.relayMessage(message.chat, responseMessage.message, { messageId: responseMessage.key.id });

    } catch (error) {
        await conn.reply(message.chat, '❌ Error al descargar el video: ' + error.toString(), message);
    }
};

handler.help = ['facebookdl <url>'];
handler.tags = ['downloader'];
handler.command = ['facebook', 'fbdl', 'fb'];

export default handler;
