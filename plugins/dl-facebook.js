import axios from 'axios';
const baileys = (await import("@whiskeysockets/baileys")).default;
const { proto } = baileys;
const { generateWAMessageFromContent } = baileys;
const { generateWAMessageContent } = baileys;

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
        const { data: response } = await axios.get(`https://api.dorratz.com/fbvideo?url=${encodeURIComponent(text)}`);

        if (!Array.isArray(response) || response.length === 0) {
            return conn.reply(message.chat, ' *No se pudo descargar el video. :c*', message);
        }

        // Buscar resoluciones disponibles
        const video1080 = response.find(v => v.resolution.includes('1080'));
        const video720 = response.find(v => v.resolution.includes('720'));

        if (!video1080 && !video720) {
            return conn.reply(message.chat, ' *No se encontraron calidades compatibles (720p o 1080p).*', message);
        }

        const cards = [];

        if (video1080) {
            const hdVideoMessage = await createVideoMessage(video1080.url);
            cards.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: null
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `𝘾𝘼𝙇𝙄𝘿𝘼𝘿 1080𝙥\n\n📥 Video en alta calidad.`
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    hasMediaAttachment: true,
                    videoMessage: hdVideoMessage
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: []
                })
            });
        }

        if (video720) {
            const sdVideoMessage = await createVideoMessage(video720.url);
            cards.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: null
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `𝘾𝘼𝙇𝙄𝘿𝘼𝘿 720𝙥\n\n📥 Video en calidad media.`
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    hasMediaAttachment: true,
                    videoMessage: sdVideoMessage
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: []
                })
            });
        }

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
                            body: proto.Message.InteractiveMessage.Body.create({
                                text: null
                            }),
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
        await conn.reply(message.chat, `*Error:* ${error.toString()}`, message);
    }
};

handler.help = ['facebookdl <url>'];
handler.tags = ['downloader'];
handler.command = ['facebook', 'fbdl', 'fb'];

export default handler;
