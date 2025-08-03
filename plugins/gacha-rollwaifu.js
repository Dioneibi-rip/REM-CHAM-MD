import { promises as fs } from 'fs'

const charactersFile = './src/database/characters.json'
const haremFile = './src/database/harem.json'
const cooldowns = {}

const COOLDOWN_TIME = 15 * 60 * 1000 // 15 minutos

async function loadJSON(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return defaultValue
  }
}

async function saveJSON(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    throw new Error(`✘ No se pudo guardar el archivo: ${filePath}`)
  }
}

let handler = async (m, { conn }) => {
  const userId = m.sender
  const now = Date.now()

  if (cooldowns[userId] && now < cooldowns[userId]) {
    const remaining = Math.ceil((cooldowns[userId] - now) / 1000)
    const min = Math.floor(remaining / 60)
    const sec = remaining % 60
    return await conn.reply(
      m.chat,
      `⏳ Debes esperar *${min}m ${sec}s* para volver a usar *#rw*.`,
      m
    )
  }

  try {
    const characters = await loadJSON(charactersFile)
    if (!characters.length) throw new Error('No hay personajes disponibles.')

    const character = characters[Math.floor(Math.random() * characters.length)]
    const image = character.img[Math.floor(Math.random() * character.img.length)]
    const harem = await loadJSON(haremFile)

    const isClaimed = !!character.user
    const claimedBy = isClaimed ? `Reclamado por @${character.user.split('@')[0]}` : 'Libre'

    const message = `
╭━━⊰ 𝑷𝑬𝑹𝑺𝑶𝑵𝑨𝑱𝑬 𝑹𝑨𝑵𝑫𝑶𝑴 ⊱━━
┃ ✦ *ɴᴏᴍʙʀᴇ*: *${character.name}*
┃ ✦ *ɢᴇ́ɴᴇʀᴏ*: *${character.gender}*
┃ ✦ *ᴠᴀʟᴏʀ*: *${character.value}*
┃ ✦ *ᴇsᴛᴀᴅᴏ*: ${claimedBy}
┃ ✦ *ғᴜᴇɴᴛᴇ*: *${character.source}*
┃ ✦ ɪ́ᴅ: *${character.id}*
╰━━━━━━━━━━━━━━━━━━━`.trim()

    const mentions = isClaimed ? [character.user] : []

    await conn.sendFile(m.chat, image, `${character.name}.jpg`, message, m, { mentions })

    cooldowns[userId] = now + COOLDOWN_TIME
  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, `❌ Error: ${err.message}`, m)
  }
}


handler.help = ['rw', 'rollwaifu', 'ver']
handler.tags = ['gacha']
handler.command = ['rw', 'rollwaifu', 'ver']
handler.group = true

export default handler