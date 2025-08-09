import cp from 'child_process';
import { promisify } from 'util';
const exec = promisify(cp.exec).bind(cp);

const handler = async (m, { conn }) => {
    try {
        conn.reply(m.chat, `💙 Speed Test....`, m);

        const { stdout, stderr } = await exec('python3 ./lib/ookla-speedtest.py --secure --share');

        if (stdout.trim()) {
            const match = stdout.match(/http[^"]+\.png/);
            const urlImagen = match ? match[0] : null;
            await conn.sendMessage(
                m.chat,
                { image: { url: urlImagen }, caption: stdout.trim() },
                { quoted: global.fkontak(m, conn) }
            );
        }
        if (stderr.trim()) {
            const match2 = stderr.match(/http[^"]+\.png/);
            const urlImagen2 = match2 ? match2[0] : null;
            await conn.sendMessage(
                m.chat,
                { image: { url: urlImagen2 }, caption: stderr.trim() },
                { quoted: global.fkontak(m, conn) }
            );
        }
    } catch (e) {
        return m.reply(e.message);
    }
};

handler.help = ['speedtest'];
handler.tags = ['info'];
handler.command = ['speedtest', 'stest', 'test'];
handler.register = true;

export default handler;
