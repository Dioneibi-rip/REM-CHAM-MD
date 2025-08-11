import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, `⚠️ 𝚙𝚘𝚛 𝚏𝚊𝚟𝚘𝚛, 𝚛𝚎𝚜𝚙𝚘𝚗𝚍𝚊 𝚊 𝚞𝚗𝚊 *𝙸𝚖𝚊𝚐𝚎𝚗* 𝚘 *𝚅𝚒́𝚍𝚎𝚘*`, m)

  await m.react(rwait)

  try {
    let media = await q.download()
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
    let link = await (isTele ? uploadImage : uploadFile)(media)
    let img = await (await fetch(`${link}`)).buffer()

    let txt = `╭───〔 ʟɪɴᴋ - ᴇɴʟᴀᴄᴇ 〕───╮\n\n`
        txt += `✦ 𝙴𝚗𝚕𝚊𝚌𝚎 : ${link}\n`
        txt += `✦ 𝙰𝚌𝚘𝚛𝚝𝚊𝚍𝚘 : ${await shortUrl(link)}\n`
        txt += `✦ 𝚃𝚊𝚖𝚊𝚗̃𝚘 : ${formatBytes(media.length)}\n`
        txt += `✦ 𝙴𝚡𝚙𝚒𝚛𝚊𝚌𝚒𝚘́𝚗 : ${isTele ? '𝙽𝚘 𝚎𝚡𝚙𝚒𝚛𝚊' : '𝙳𝚎𝚜𝚌𝚘𝚗𝚘𝚌𝚒𝚍𝚘'}\n\n`
        txt += `╰───────────────✦\n`
        txt += `> ʙʏ ${dev}`

    await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, fkontak)
    await m.react(done)

  } catch {
    await m.react(error)
  }
}

handler.help = ['tourl']
handler.tags = ['transformador']
handler.register = true
handler.command = ['tourl', 'upload']

export default handler

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function shortUrl(url) {
  let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
  return await res.text()
}
