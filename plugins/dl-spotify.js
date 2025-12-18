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
      throw new Error("El enlace no pertenece a Spotify")

    /* ====== PASO 1: OBTENER INFO ====== */
    let infoRes
    try {
      infoRes = await axios.get(
        `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`,
        { timeout: 20000 }
      )
    } catch (e) {
      throw new Error(
        `Fallo al obtener información del track\n${e.response?.status || ""} ${e.response?.statusText || e.message}`
      )
    }

    const result = infoRes?.data?.result
    if (!result)
      throw new Error("La API no devolvió información del track")

    const trackId =
      result.type === "album" ? result.tracks?.[0]?.id : result.id

    if (!trackId)
      throw new Error("No se pudo obtener el ID del track")

    /* ====== PASO 2: CONVERTIR A MP3 ====== */
    let convertRes
    try {
      convertRes = await axios.get(
        `https://api.fabdl.com/spotify/mp3-convert-task/${result.gid}/${trackId}`,
        { timeout: 20000 }
      )
    } catch (e) {
      throw new Error(
        `Fallo al iniciar la conversión MP3\n${e.response?.status || ""} ${e.response?.statusText || e.message}`
      )
    }

    const tid = convertRes?.data?.result?.tid
    if (!tid)
      throw new Error("La conversión no devolvió un TID válido")

    /* ====== PASO 3: PROGRESO ====== */
    let downloadUrl = null
    let status = null

    for (let i = 0; i < 10; i++) {
      try {
        const progressRes = await axios.get(
          `https://api.fabdl.com/spotify/mp3-convert-progress/${tid}`,
          { timeout: 20000 }
        )

        status = progressRes?.data?.result?.status

        if (status === "finished") {
          downloadUrl =
            "https://api.fabdl.com" +
            progressRes.data.result.download_url
          break
        }
      } catch (e) {
        throw new Error(
          `Error al consultar progreso de conversión\n${e.response?.status || ""} ${e.response?.statusText || e.message}`
        )
      }

      await new Promise(r => setTimeout(r, 1500))
    }

    if (!downloadUrl)
      throw new Error(`La conversión no finalizó (estado: ${status})`)

    /* ====== INFO ====== */
    const durationMs =
      result.type === "album"
        ? result.tracks?.[0]?.duration_ms
        : result.duration_ms

    const duration = durationMs
      ? new Date(durationMs).toISOString().substr(14, 5)
      : "Desconocida"

    await conn.sendMessage(
      m.chat,
      {
        image: { url: result.image },
        caption:
`╭─❏ *SPOTIFY 🎵*
│🎶 *Título:* ${result.name}
│👤 *Artista:* ${result.artists}
│⏱ *Duración:* ${duration}
│🔗 *Link:* ${url}
╰─────────────❏`,
      },
      { quoted: m }
    )

    /* ====== ENVÍO MP3 ====== */
    await conn.sendFile(
      m.chat,
      downloadUrl,
      `${result.name}.mp3`,
      `🎧 ${result.name}`,
      m
    )
  } catch (err) {
    console.error(err)

    let errorMsg = "❌ Error desconocido"

    if (err instanceof Error) {
      errorMsg = `❌ *Error Spotify*\n${err.message}`
    } else if (typeof err === "string") {
      errorMsg = `❌ *Error Spotify*\n${err}`
    }

    m.reply(errorMsg)
  }
}

handler.command = /^spotify$/i
handler.help = ["spotify <url>"]
handler.tags = ["downloader"]

export default handler
