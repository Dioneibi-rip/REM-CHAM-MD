import fetch from "node-fetch"
import FormData from "form-data"

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(
`🎧 *DESCARGA SPOTIFY*
Ejemplo:
${usedPrefix + command} https://open.spotify.com/track/30SdJAyFsYxAMBfJmNNPqI`
    )
  }

  try {
    const query = args.join(" ")

    /* ===== PASO 1: BUSCAR CANCIÓN ===== */
    const searchRes = await fetch(
      `https://spotdown.org/api/song-details?url=${encodeURIComponent(query)}`,
      { headers: { accept: "application/json" } }
    )

    if (!searchRes.ok)
      throw new Error(`song-details ${searchRes.status}`)

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
│🔗 *Link:* ${song.url}
╰─────────────❏
> ⏬ Descargando audio...`,
      },
      { quoted: m }
    )

    /* ===== PASO 2: DESCARGA (FORMDATA REAL) ===== */
    const form = new FormData()
    form.append("url", song.url)

    const downloadRes = await fetch(
      "https://spotdown.org/api/download",
      {
        method: "POST",
        body: form, // ❗ CLAVE
      }
    )

    if (!downloadRes.ok || !downloadRes.body)
      throw new Error(
        `download ${downloadRes.status} ${downloadRes.statusText}`
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
    m.reply(`❌ *Spotify Error*\n${err.message || err}`)
  }
}

handler.command = /^spotify$/i
handler.help = ["spotify <url | nombre>"]
handler.tags = ["downloader"]

export default handler
