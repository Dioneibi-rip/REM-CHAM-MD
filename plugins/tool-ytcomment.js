let handler = async (m, { conn, text }) => {
  if (!text) throw '🚫 ᴇsᴄʀɪʙᴇ ᴜɴ ᴄᴏᴍᴇɴᴛᴀʀɪᴏ ᴘᴀʀᴀ ǫᴜᴇ ᴀᴘᴀʀᴇᴢᴄᴀ ᴇɴ ʟᴀ ɪᴍᴀɢᴇɴ.'

  let avatar = await conn.profilePictureUrl(m.sender, 'image')
    .catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')

  let username = await conn.getName(m.sender)

  let url = global.API('https://some-random-api.com', '/canvas/misc/youtube-comment', {
    avatar: avatar,
    comment: text,
    username: username
  })

  conn.sendFile(m.chat, url, 'ytcomment.png', '*✅ ¡Gracias por tu comentario!*', m)
}

handler.help = ['ytcomment <comentario>']
handler.tags = ['maker']
handler.command = /^(ytcomment)$/i

export default handler