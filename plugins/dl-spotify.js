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
      throw new Error("URL de Spotify inválida")

    /* ===== PASO 1: INFO ===== */
    let infoRes
    try {
      infoRes = await axios.get(
        `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`,
        { headers: { accept: "application/json" } }
      )
    } catch (e) {
      throw new Error(
        `Fallo al obtener info del track\n` +
        `Status: ${e.response?.status}\n` +
        `Respuesta: ${JSON.stringify(e.response?.data)}`
      )
    }

    const { result } = infoRes.data || {}
    if (!result) throw new Error("La API no devolvió datos del track")

    const trackId =
      result.type === "album" ? result.tracks[0]?.id : result.id
    if (!trackId) throw new Error("No se pudo obtener el ID del track")

    /* ===== PASO 2: CONVERSIÓN ===== */
    let convertRes
    try {
      convertRes = await axios.get(
        `https://api.fabdl.com/spotify/mp3-convert-task/${result.gid}/${trackId}`
      )
    } catch (e) {
      throw new Error(
        `Fallo al iniciar conversión MP3\n` +
        `Status: ${e.response?.status}\n` +
        `Respuesta: ${JSON.stringify(e.response?.data)}`
      )
    }

    const tid = convertRes.data?.result?.tid
    if (!tid) throw new Error("La API no devolvió el TID")

    /* ===== PASO 3: PROGRESO ===== */
    let downloadUrl
    for (let i = 0; i < 10; i++) {
      let progressRes
      try {
        progressRes = await axios.get(
          `https://api.fabdl.com/spotify/mp3-convert-progress/${tid}`
        )
      } catch (e) {
        throw new Error(
          `Error consultando progreso\n` +
          `Status: ${e.response?.status}\n` +
          `Respuesta: ${JSON.stringify(e.response?.data)}`
        )
      }

      const status = progressRes.data?.result?.status
      if (status === "finished") {
        downloadUrl =
          "https://api.fabdl.com" +
          progressRes.data.result.download_url
        break
      }

      if (status === "error")
        throw new Error("La conversión falló en el servidor")

      await new Promise(r => setTimeout(r, 1500))
    }

    if (!downloadUrl)
      throw new Error("Tiempo de espera agotado al convertir el audio")

    /* ===== ENVÍO ===== */
    await conn.sendFile(
      m.chat,
      downloadUrl,
      `${result.name}.mp3`,
      `🎧 ${result.name}`,
      m
    )

  } catch (err) {
    console.error("SPOTIFY ERROR:", err)

    let msg = "❌ Error desconocido"
    if (err instanceof Error) msg = `❌ *ERROR SPOTIFY*\n\n${err.message}`

    m.reply(msg)
  }
}

handler.command = /^spotify$/i
handler.help = ["spotify <url>"]
handler.tags = ["downloader"]

export default handler
