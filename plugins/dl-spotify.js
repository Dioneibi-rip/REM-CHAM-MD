import fetch from "node-fetch"

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
    const query = args.join(" ")

    /* ===== PASO 1: BUSCAR ===== */
    const searchRes = await fetch(
      `https://spotdown.org/api/song-details?url=${encodeURIComponent(query)}`,
      { headers: { accept: "application/json" } }
    )

    if (!searchRes.ok)
      throw new Error(
        `song-details falló (${searchRes.status} ${searchRes.statusText})`
      )

    const searchData = await searchRes.json()
    if (!searchData.songs?.length)
      throw new Error("No se encontraron canciones")

    const song = searchData.songs[0]

    await conn.sendMessage(
      m.chat,
      {
        caption:
`╭─❏ *SPOTIFY 🎵*
│🎶 *Título:* ${song.title}
│👤 *Artista:* ${song.artist}
│⏱ *Duración:* ${song.duration || "Desconocida"}
│🔗 *Link:* ${song.url}
╰─────────────❏
> ⏬ Descargando audio...`,
      },
      { quoted: m }
    )

    /* ===== PASO 2: DESCARGA (FIX) ===== */
    const body = new URLSearchParams({ url: song.url }).toString()

    const downloadRes = await fetch(
      "https://spotdown.org/api/download",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body,
      }
    )

    if (!downloadRes.ok || !downloadRes.body)
      throw new Error(
        `download falló (${downloadRes.status} ${downloadRes.statusText})`
      )

    const buffer = Buffer.from(await downloadRes.arrayBuffer())

    /* ===== ENVIAR MP3 ===== */
    await conn.sendFile(
      m.chat,
      buffer,
      `${song.title}.mp3`,
      `🎧 ${song.title} - ${song.artist}`,
      m
    )
  } catch (err) {
    console.error(err)

    let msg = "❌ Error desconocido"
    if (err instanceof Error) msg = `❌ *Spotify Error*\n${err.message}`
    if (typeof err === "string") msg = `❌ *Spotify Error*\n${err}`

    m.reply(msg)
  }
}

handler.command = /^spotify$/i
handler.help = ["spotify <url | nombre>"]
handler.tags = ["downloader"]

export default handler
