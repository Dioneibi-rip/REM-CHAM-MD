import axios from "axios"

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(
`🎧 *DESCARGA SPOTIFY*
Ingresa un enlace válido de Spotify

📌 Ejemplo:
${usedPrefix + command} https://open.spotify.com/track/30SdJAyFsYxAMBfJmNNPqI`
    )
  }

  try {
    const url = args[0]
    if (!/open\.spotify\.com/.test(url))
      throw "❌ Enlace de Spotify inválido"

    const infoRes = await axios.get(
      `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          referer: "https://spotifydownload.org/",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/116.0.0.0 Mobile Safari/537.36",
        },
      }
    )

    const { result } = infoRes.data
    if (!result) throw "❌ No se pudo obtener información"

    const trackId =
      result.type === "album" ? result.tracks[0].id : result.id

    const convertRes = await axios.get(
      `https://api.fabdl.com/spotify/mp3-convert-task/${result.gid}/${trackId}`,
      { headers: { accept: "application/json" } }
    )

    const tid = convertRes.data?.result?.tid
    if (!tid) throw "❌ Error al iniciar conversión"

    let downloadUrl, status
    for (let i = 0; i < 10; i++) {
      const progress = await axios.get(
        `https://api.fabdl.com/spotify/mp3-convert-progress/${tid}`,
        { headers: { accept: "application/json" } }
      )

      status = progress.data.result.status
      if (status === "finished") {
        downloadUrl =
          "https://api.fabdl.com" +
          progress.data.result.download_url
        break
      }

      await new Promise(r => setTimeout(r, 1500))
    }

    if (!downloadUrl)
      throw "❌ No se pudo generar el archivo MP3"

    const durationMs =
      result.type === "album"
        ? result.tracks[0].duration_ms
        : result.duration_ms

    const duration = new Date(durationMs).toISOString().substr(14, 5)

    await conn.sendMessage(
      m.chat,
      {
        image: { url: result.image },
        caption:
`╭─❏ *DESCARGA SPOTIFY 🎵*
│🎶 *Título:* ${result.name}
│👤 *Artista:* ${result.artists}
│⏱ *Duración:* ${duration}
│🔗 *Link:* ${url}
╰─────────────❏`,
      },
      { quoted: m }
    )

    await conn.sendFile(
      m.chat,
      downloadUrl,
      `${result.name}.mp3`,
      `🎧 ${result.name}`,
      m
    )
  } catch (e) {
    console.error(e)
    m.reply(
      typeof e === "string"
        ? e
        : "❌ Error al descargar desde Spotify"
    )
  }
}

handler.command = /^spotify$/i
handler.help = ["spotify <url>"]
handler.tags = ["downloader"]

export default handler
