let handler = async (m, { conn, args }) => {
  let text = args.slice(1).join(' ')
  let who = m.quoted 
    ? m.quoted.sender 
    : m.mentionedJid && m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.fromMe 
        ? conn.user.jid 
        : m.sender

  const avatar = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/08f43c70269b38fd8ac12.jpg')

  const imageUrl = global.API('https://some-random-api.com', '/canvas/misc/its-so-stupid', {
    avatar,
    dog: text || 'Soy+Estupido'
  })

  await conn.sendFile(m.chat, imageUrl, 'error.png', `*@${who.split('@')[0]}*`, m, { mentions: [who] })
}

handler.help = ['itssostupid', 'iss', 'stupid']
handler.tags = ['maker']
handler.command = /^(itssostupid|iss|stupid)$/i

export default handler
