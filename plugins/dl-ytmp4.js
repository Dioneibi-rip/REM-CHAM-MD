import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `╭─⊷ 𝙐𝙎𝙊 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊
│
├ ❏ *Ejemplo:* 
└─▸ ${usedPrefix + command} https://youtu.be/ejemplo`, m)
  }

  let youtubeLink = args[0]

  await conn.reply(m.chat, `⌛ 𝙀𝙎𝙋𝙀𝙍𝘼.. 𝙨𝙚 𝙚𝙨𝙩𝙖́ 𝙘𝙖𝙧𝙜𝙖𝙣𝙙𝙤 𝙩𝙪 𝙫𝙞𝙙𝙚𝙤...\n\n🔗 *Enlace:* ${youtubeLink}`, m, rcanal)

  try {
    if (typeof youtubeLink !== 'string' || !youtubeLink.startsWith('http')) {
      throw new Error('URL inválida proporcionada')
    }

    const apiKey = 'stellar-bFA8UWSA'
    const fetchUrl = `https://api.stellarwa.xyz/dow/ytmp4?url=${encodeURIComponent(youtubeLink)}&apikey=${apiKey}`
    const response = await fetch(fetchUrl)
    const data = await response.json()

    if (!data.status || !data.data?.dl) {
      return conn.reply(m.chat, `❌ _Error:_ ${data.message || 'No se encontró el video'}`, m)
    }

    const { title, dl: videoUrl, thumbnail } = data.data
    const caption = `╭─⊷ 𝙑𝙄𝘿𝙀𝙊 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝘼𝘿𝙊
│
├ 🎥 *Título:* ${title}
└🔗 *Fuente:* ${youtubeLink}`

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption: caption,
      thumbnail: await fetch(thumbnail).then(res => res.buffer())
    }, { quoted: m })

  } catch (error) {
    console.error('Error:', error)
    conn.reply(m.chat, `❌ _Error:_ Ocurrió un problema al procesar la solicitud`, m)
  }
}

handler.help = ['ytmp4 <url>']
handler.tags = ['dl']
handler.command = /^video|dlmp4|getvid|yt(v|mp4)?$/i
handler.register = true

export default handler
