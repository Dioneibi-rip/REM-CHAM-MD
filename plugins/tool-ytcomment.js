let handler = async (m, { conn, text }) => {
  if (!text) throw '🚫 Escribe un comentario para que aparezca en la imagen.'

  // Obtiene la URL del avatar
  let avatar = await conn.profilePictureUrl(m.sender, 'image')
    .catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')

  // Obtiene el nombre del usuario y lo codifica para la URL
  let username = await conn.getName(m.sender) || 'Usuario'
  username = encodeURIComponent(username)

  // También codificamos el comentario para evitar problemas con caracteres especiales
  let comment = encodeURIComponent(text)

  // Genera la URL de la imagen
  let url = `https://some-random-api.com/canvas/misc/youtube-comment?avatar=${encodeURIComponent(avatar)}&username=${username}&comment=${comment}`

  // Envía la imagen
  await conn.sendFile(m.chat, url, 'ytcomment.png', '*✅ ¡Gracias por tu comentario!*', m)
}

handler.help = ['ytcomment <comentario>']
handler.tags = ['maker']
handler.command = /^(ytcomment)$/i

export default handler
