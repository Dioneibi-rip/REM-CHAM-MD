import axios from "axios"
import * as cheerio from "cheerio"

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text)
    return m.reply(
      `🌐 Ingresa un enlace válido de Facebook\n📌 Ejemplo:\n${usedPrefix + command} https://www.facebook.com/watch/?v=123456789`
    )

  try {
    const validUrl = /(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/
    if (!validUrl.test(text)) throw "❌ URL de Facebook inválida"

    const formData = `url=${encodeURIComponent(text)}&lang=en&type=redirect`

    const response = await axios.post(
      "https://getvidfb.com/",
      formData,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/132.0.0.0 Mobile Safari/537.36",
          referer: "https://getvidfb.com/",
        },
        timeout: 30000,
      }
    )

    const $ = cheerio.load(response.data)
    const videoContainer = $("#snaptik-video")
    if (!videoContainer.length)
      throw "❌ No se pudo extraer el video (Facebook bloqueó el acceso)"

    const title =
      videoContainer.find(".snaptik-middle h3").text().trim() ||
      "Facebook Video"

    const thumb = videoContainer.find(".snaptik-left img").attr("src")

    const downloads = []

    videoContainer.find(".abuttons a").each((_, el) => {
      const url = $(el).attr("href")
      const txt = $(el).text().toLowerCase()

      if (!url || !url.startsWith("http")) return

      let resolution = "SD"
      let format = "mp4"

      if (txt.includes("hd")) resolution = "HD"
      if (txt.includes("mp3") || txt.includes("audio")) format = "mp3"

      downloads.push({ url, resolution, format })
    })

    if (!downloads.length)
      throw "❌ No se encontraron enlaces de descarga"

    const selected =
      downloads.find(v => v.resolution === "HD" && v.format === "mp4") ||
      downloads.find(v => v.format === "mp4") ||
      downloads[0]

    const caption = `
╭───────⊷
│👑 *FACEBOOK*
├────────────────
│🎬 *Título:* ${title}
│📥 *Calidad:* ${selected.resolution}
│📁 *Formato:* ${selected.format}
╰───────⊷
> 🎞️ Enviando el contenido...
`.trim()

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m })

    const videoRes = await axios.get(selected.url, {
      responseType: "arraybuffer",
    })

    await conn.sendFile(
      m.chat,
      Buffer.from(videoRes.data),
      "facebook.mp4",
      `🎥 ${title}`,
      m
    )
  } catch (err) {
    console.error(err)
    m.reply(
      typeof err === "string"
        ? err
        : "⚠️ Error al procesar el video de Facebook"
    )
  }
}

handler.command = /^facebook|fb$/i
handler.help = ["facebook <url>"]
handler.tags = ["downloader"]

export default handler
