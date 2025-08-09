import cp from 'child_process';
import { promisify } from 'util';
const exec = promisify(cp.exec).bind(cp);

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
    },
    message: {
        contactMessage: {
            displayName: this.getName ? this.getName(m.sender) : m.pushName,
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${this.getName ? this.getName(m.sender) : m.pushName};;;\nFN:${this.getName ? this.getName(m.sender) : m.pushName}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nEND:VCARD`
        }
    }
};

const handler = async (m) => {
    let o;
    try {
      conn.reply(m.chat, `💙 Speed Test....`, m, )
      o = await exec('python3 ./lib/ookla-speedtest.py --secure --share');
        const {stdout, stderr} = o;
        if (stdout.trim()) {
            const match = stdout.match(/http[^"]+\.png/);
            const urlImagen = match ? match[0] : null;
            await conn.sendMessage(m.chat, {image: {url: urlImagen}, caption: stdout.trim()}, {quoted: fkontak});
        }
        if (stderr.trim()) { 
            const match2 = stderr.match(/http[^"]+\.png/);
            const urlImagen2 = match2 ? match2[0] : null;    
            await conn.sendMessage(m.chat, {image: {url: urlImagen2}, caption: stderr.trim()}, {quoted: fkontak});
        }
    } catch (e) {
        o = e.message;
        return m.reply(o)
    }
};
handler.help = ['speedtest'];
handler.tags = ['info'];
handler.command = ['speedtest', 'stest', 'test'];
handler.register = true;

export default handler;