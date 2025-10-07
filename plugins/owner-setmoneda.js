let handler = async (m, { conn, text }) => {
  if (!global.db.data.settings) global.db.data.settings = {}

  let settings = global.db.data.settings[conn.user.jid]
  if (!settings) global.db.data.settings[conn.user.jid] = {}, settings = global.db.data.settings[conn.user.jid]

  if (!text) {
    const currentMoneda = settings.moneda || 'No establecida'
    return m.reply(
`*🌸 ᴍᴏɴᴇᴅᴀ ᴅᴇʟ ʙᴏᴛ 🌸*

Por favor, escribe el nombre de la moneda que deseas usar.
> *Ejemplo:* #setmoneda Diamantes 💎

*Moneda actual:* ${currentMoneda}`
    )
  }

  settings.moneda = text.trim()

  m.reply(`✅ ᴍᴏɴᴇᴅᴀ ᴀᴄᴛᴜᴀʟɪᴢᴀᴅᴀ:\n> Nueva moneda: *${settings.moneda}*`)
}

handler.help = ['setmoneda <nombre>']
handler.tags = ['owner']
handler.command = ['setmoneda']
handler.rowner = true

export default handler
