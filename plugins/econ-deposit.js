import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  let emoji = '🏦', emoji2 = '❌'
  let imgUrl = 'https://i.imgur.com/P3u2et7.jpg'

  if (!args[0]) 
    throw `${emoji} Ingresa la cantidad de *${m.moneda}* que deseas depositar.\n\nEjemplo:\n> ${usedPrefix + command} 500\n> ${usedPrefix + command} all`

  if (args[0].toLowerCase() === 'all') {
    let total = user.credit || 0
    if (total === 0) 
      throw `${emoji2} No tienes nada en tu cartera para depositar.`
    user.credit = 0
    user.bank += total

    let message = `
🏦 *Depósito Realizado* 🏦

💰 *Cantidad Depositada:* ${total.toLocaleString()} ${m.moneda}
👤 *Saldo Actual en la Bóveda:* ${user.bank.toLocaleString()} ${m.moneda}

Gracias por depositar en tu bóveda. ¡Tu oro está seguro con nosotros! 💼✨
`.trim()

    try {
      const responseImg = await axios.get(imgUrl, { responseType: 'arraybuffer' })
      await conn.sendFile(m.chat, responseImg.data, 'deposito.jpg', message, m)
    } catch {
      await conn.reply(m.chat, message, m)
    }
    return
  }

  let cantidad = parseInt(args[0])
  if (isNaN(cantidad) || cantidad <= 0)
    throw `${emoji2} Debes ingresar una cantidad válida para depositar.\n\nEjemplo:\n> ${usedPrefix + command} 100\n> ${usedPrefix + command} all`

  if (user.credit < cantidad)
    throw `${emoji2} Solo tienes *${user.credit.toLocaleString()} ${m.moneda}* en tu cartera.

  user.credit -= cantidad
  user.bank += cantidad

  let message = `
🏦 *Depósito Realizado* 🏦

💰 *Cantidad Depositada:* ${cantidad.toLocaleString()} ${m.moneda}
👤 *Saldo Actual en la Bóveda:* ${user.bank.toLocaleString()} ${m.moneda}

Gracias por depositar en tu bóveda. ¡Tus ${m.moneda} están seguros con nosotros! 💼✨
`.trim()

  try {
    const responseImg = await axios.get(imgUrl, { responseType: 'arraybuffer' })
    await conn.sendFile(m.chat, responseImg.data, 'deposito.jpg', message, m)
  } catch {
    await conn.reply(m.chat, message, m)
  }
}

handler.help = ['depositar <cantidad>', 'depositar all']
handler.tags = ['economy']
handler.command = ['depositar', 'deposit', 'dep', 'd', 'aguardar']
handler.group = true
handler.register = true

export default handler
