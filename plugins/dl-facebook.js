import axios from 'axios';
const baileys = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
    if (!text) {
        return conn.reply(message.chat, '*¿Qué video de Facebook quieres descargar? :3*', message);
    }

    try {
        const { data } = await axios.get(`https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(text)}`);

        if (!data || !data.data || data.data.status !== true) {
            return conn.reply(message.chat, '*No se pudo obtener el video. Verifica el enlace.*', message);
        }

        const videoUrl = data.data.hd_url || data.data.sd_url;
        if (!videoUrl) {
            return conn.reply(message.chat, '*El video no tiene una calidad disponible para descargar.*', message);
        }

        await conn.sendMessage(
            message.chat,
            {
                video: { url: videoUrl },
                caption: '*🎬 Video descargado con éxito desde Facebook.*'
            },
            { quoted: message }
        );

    } catch (error) {
        console.error(error);
        await conn.reply(message.chat, '❌ Error al descargar el video: ' + error.toString(), message);
    }
};

handler.help = ['facebookdl <url>'];
handler.tags = ['downloader'];
handler.command = ['facebook', 'fbdl', 'fb'];

export default handler;
