import axios from 'axios'

const isValidYouTubeUrl = (url) => {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url)
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const loading = '⏳'
  const success = '✅'
  const error = '❌'

  if (!args[0]) {
    return m.reply(
      `💙 Ingresa un enlace de *YouTube*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/dQw4w9WgXcQ`
    )
  }

  if (!isValidYouTubeUrl(args[0])) {
    return m.reply('❌ El enlace no es válido de YouTube')
  }

  try {
    await m.react(loading)

    /* ================= SCRAPER CLIPTO ================= */
    const res = await axios.post(
      'https://www.clipto.com/api/youtube',
      { url: args[0] },
      {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!res.data || res.data.success !== true) {
      throw new Error('Respuesta inválida de Clipto')
    }

    const medias = res.data.medias || []

    const audio = medias
      .filter(m =>
        m.type === 'audio' &&
        ['m4a', 'mp3', 'opus'].includes(m.ext)
      )
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0]

    if (!audio) {
      throw new Error('No se encontró audio válido')
    }
    /* =================================================== */

    const title = res.data.title || 'audio'
    const audioUrl = audio.url
    const ext = audio.ext

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: audioUrl },
        mimetype: ext === 'opus'
          ? 'audio/ogg; codecs=opus'
          : 'audio/mpeg',
        fileName: `${title}.${ext}`,
        caption: `🎵 *${title}*`,
        ptt: true
      },
      { quoted: m }
    )

    await m.react(success)

  } catch (err) {
    console.error(err)
    await m.react(error)
    m.reply(`❌ Error al descargar audio:\n${err.message}`)
  }
}

handler.help = ['ytmp3 <url>']
handler.tags = ['downloader']
handler.command = ['ytmp3', 'ytaudio', 'mp3']
handler.limit = 1

export default handler
