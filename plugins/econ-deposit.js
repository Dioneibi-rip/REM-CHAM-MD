let handler = async (m, { conn, args }) => {
  let user = global.db.data.users[m.sender]
  let emoji = '🏦', emoji2 = '❌'

  if (!user.credit) user.credit = 0
  if (!user.bank) user.bank = 0

  if (!args[0]) 
    return m.reply(`${emoji} Ingresa la cantidad de *${m.moneda}* que deseas depositar.\n\n> Ejemplo 1: *.depositar 2500*\n> Ejemplo 2: *.depositar all*`)

  if (args[0].toLowerCase() === 'all') {
    let total = user.credit || 0
    if (total === 0) 
      return m.reply(`${emoji2} No tienes nada en tu cartera para depositar.`)
    user.credit = 0
    user.bank += total
    return m.reply(`✅ Depositaste *${total.toLocaleString()} ${m.moneda}* en tu bóveda.\n\n💰 Cartera: *${user.credit.toLocaleString()}* | 🏦 Banco: *${user.bank.toLocaleString()}*\n\nTu oro ahora está seguro 💼✨`)
  }

  if (isNaN(args[0]) || parseInt(args[0]) <= 0)
    return m.reply(`${emoji2} Debes ingresar una cantidad válida para depositar.\n\n> Ejemplo 1: *.depositar 1000*\n> Ejemplo 2: *.depositar all*`)

  let cantidad = parseInt(args[0])

  if (user.credit < cantidad)
    return m.reply(`${emoji2} No tienes suficiente *${m.moneda}*.\n💰 Cartera actual: *${user.credit.toLocaleString()}*`)

  user.credit -= cantidad
  user.bank += cantidad

  return m.reply(`🏦 *Depósito Realizado* 🏦\n\n💰 *Cantidad Depositada:* ${cantidad.toLocaleString()} ${m.moneda}\n👤 *Saldo en la Bóveda:* ${user.bank.toLocaleString()} ${m.moneda}\n\nGracias por depositar en tu bóveda. ¡Tu oro está seguro con nosotros! 💼✨`)
}

handler.help = ['depositar <cantidad|all>']
handler.tags = ['economy']
handler.command = ['depositar', 'dep', 'deposit', 'd']
handler.group = true
handler.register = true

export default handler
