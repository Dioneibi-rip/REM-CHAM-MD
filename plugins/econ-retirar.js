import axios from 'axios';

const emojis = ['🌟', '💼', '💰', '🏦', '📈', '📊', '📉', '💹', '💵', '💲', '💱', '🏧', '💳', '💸', '🧾'];
const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

const line = '━━━━━━━━━━━━━━━━━';
const decorLine = '═'.repeat(line.length);

let handler = async (m, { conn, usedPrefix, args }) => {
    let user = global.db.data.users[m.sender];
    let amountArg = args[0];

    if (!amountArg)
        return m.reply(`${randomEmoji()} Ingresa la cantidad de *${m.moneda}* que deseas retirar.\n> Ejemplo: *${usedPrefix}retirar 5000* o *${usedPrefix}retirar all*`);

    let amount;
    if (amountArg.toLowerCase() === 'all') {
        amount = user.bank;
        if (amount <= 0) return m.reply(`${randomEmoji()} No tienes *${m.moneda}* en el banco para retirar.`);
    } else {
        amount = parseInt(amountArg);
        if (isNaN(amount) || amount < 1)
            return m.reply(`${randomEmoji()} Debes ingresar una cantidad válida.\n> Ejemplo 1 » *${usedPrefix}retirar 25000*\n> Ejemplo 2 » *${usedPrefix}retirar all*`);
        if (user.bank < amount)
            return m.reply(`${randomEmoji()} Solo tienes *${user.bank} ${m.moneda}* en el banco.`);
    }

    user.bank -= amount;
    user.credit += amount;

    const wealthLevel = () => {
        if (user.bank <= 3000) return '𝙷𝚄𝙼𝙸𝙻𝙳𝙴';
        else if (user.bank <= 6000) return '𝙳𝙴 𝙱𝙰𝙹𝙾𝚂 𝚁𝙴𝙲𝚄𝚁𝚂𝙾𝚂';
        else if (user.bank <= 100000) return '𝙲𝙻𝙰𝚂𝙴 𝙼𝙴𝙳𝙸𝙰';
        else if (user.bank <= 1000000) return '𝚁𝙸𝙺𝙾';
        else if (user.bank <= 10000000) return '𝙼𝙸𝙻𝙻𝙾𝙽𝙰𝚁𝙸𝙾';
        else if (user.bank <= 1000000000) return '𝙼𝚄𝙻𝚃𝙸𝙼𝙸𝙻𝙻𝙾𝙽𝙰𝚁𝙸𝙾';
        else return '𝙱𝙸𝙻𝙻𝙾𝙽𝙰𝚁𝙸𝙾';
    };

    let message = `
${decorLine}
${randomEmoji()} *𝙍𝙀𝙏𝙄𝙍𝙊 𝘿𝙀 ${m.moneda.toUpperCase()}* ${randomEmoji()}
${decorLine}

${randomEmoji()} *Cantidad Retirada:* ${amount} ${m.moneda}
${randomEmoji()} *Nuevo Saldo:* ${user.credit} ${m.moneda} en la billetera
${randomEmoji()} *Nivel de Riqueza:* ${wealthLevel()} ${randomEmoji()}

✨ ¡Retiro exitoso! ✨
`.trim();

    await conn.reply(m.chat, message, m);
}

handler.help = ['retirar'];
handler.tags = ['economy'];
handler.command = ['withdraw', 'with', 'retirar'];
handler.register = true;
handler.group = true;

export default handler;
