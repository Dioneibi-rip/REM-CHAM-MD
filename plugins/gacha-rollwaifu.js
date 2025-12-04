import { promises as fs } from 'fs'
const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'
export const cooldowns = {}
global.activeRolls = global.activeRolls || {}
async function loadJSON(path) {
try {
const data = await fs.readFile(path, 'utf-8')
return JSON.parse(data)
} catch { return [] }
}
let handler = async (m, { conn }) => {
const userId = m.sender
const now = Date.now()
if (cooldowns[userId] && now < cooldowns[userId]) {
const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
const minutes = Math.floor(remainingTime / 60)
const seconds = remainingTime % 60
return await conn.reply(m.chat, `( ⸝⸝･̆⤚･̆⸝⸝) ¡𝗗𝗲𝗯𝗲𝘀 𝗲𝘀𝗽𝗲𝗿𝗮𝗿 *${minutes} minutos y ${seconds} segundos* 𝗽𝗮𝗿𝗮 𝘃𝗼𝗹𝘃𝗲𝗿 𝗮 𝘂𝘀𝗮𝗿 *#rw* 𝗱𝗲 𝗻𝘂𝗲𝘃𝗼.`, m)
}
try {
const characters = await loadJSON(charactersFilePath)
if (!characters.length) throw new Error('Base de datos vacía')
const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
let randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]
if (randomImage.includes('.webp')) randomImage = `https://wsrv.nl/?url=${encodeURIComponent(randomImage)}&output=png`
const statusMessage = randomCharacter.user ? `Reclamado por @${randomCharacter.user.split('@')[0]}` : 'Libre'
if (!randomCharacter.user) {
global.activeRolls[randomCharacter.id] = { user: userId, time: Date.now() }
}
const message = `╭━━⊰ 𝑷𝑬𝑹𝑺𝑶𝑵𝑨𝑱𝑬 𝑹𝑨𝑵𝑫𝑶𝑴 ⊱━━
┃ ✦ *ɴᴏᴍʙʀᴇ*: *${character.name}*
┃ ✦ *ɢᴇ́ɴᴇʀᴏ*: *${character.gender}*
┃ ✦ *ᴠᴀʟᴏʀ*: *${character.value}*
┃ ✦ *ᴇsᴛᴀᴅᴏ*: ${claimedBy}
┃ ✦ *ғᴜᴇɴᴛᴇ*: *${character.source}*
┃ ✦ ɪ́ᴅ: *${character.id}*
╰━━━━━━━━━━━━━━━━━━━`
const mentions = statusMessage.startsWith('Reclamado por') ? [randomCharacter.user] : []
await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { mentions })
cooldowns[userId] = now + 15 * 60 * 1000
} catch (error) {
await conn.reply(m.chat, `✘ 𝗘𝗿𝗿𝗼𝗿 𝗮𝗹 𝗰𝗮𝗿𝗴𝗮𝗿 𝗲𝗹 𝗽𝗲𝗿𝘀𝗼𝗻𝗮𝗷𝗲: ${error.message}`, m)
}
}
handler.help = ['rw', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['rw', 'rollwaifu']
handler.group = true
export default handler