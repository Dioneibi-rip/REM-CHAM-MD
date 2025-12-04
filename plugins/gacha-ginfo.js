import { promises as fs } from 'fs'
import { cooldowns as rwCooldowns } from './gacha-rollwaifu.js'
import { cooldowns as claimCooldowns } from './gacha-claim.js'
import { cooldowns as voteCooldowns, voteCooldownTime } from './gacha-vote.js'
const charactersFilePath = './src/database/characters.json'
function formatTime(ms) {
if (!ms || ms <= 0) return 'Ahora.'
const totalSeconds = Math.ceil(ms / 1000)
const minutes = Math.floor(totalSeconds / 60)
const seconds = totalSeconds % 60
return `${minutes} minutos ${seconds} segundos`
}
let handler = async (m, { conn }) => {
const userId = m.sender
const now = Date.now()
let userName = await conn.getName(userId).catch(() => userId)
try {
const rwRemaining = (rwCooldowns?.[userId] || 0) - now
const claimRemaining = (claimCooldowns?.[userId] || 0) - now
let voteRemaining = 0
if (voteCooldowns?.get) {
const lastVote = voteCooldowns.get(userId)
if (lastVote) voteRemaining = (lastVote + (voteCooldownTime || 0)) - now
}
let allCharacters = []
try {
const data = await fs.readFile(charactersFilePath, 'utf-8')
allCharacters = JSON.parse(data)
} catch (e) {
return conn.reply(m.chat, '《✧》Hubo un error al cargar la base de datos.', m)
}
let claimedCount = 0
let totalValue = 0
for (let i = 0; i < allCharacters.length; i++) {
if (allCharacters[i].user === userId) {
claimedCount++
totalValue += (Number(allCharacters[i].value) || 0)
}
}
let response = `*❀ Usuario \`<${userName}>\`*\n\n`
response += `ⴵ RollWaifu » *${formatTime(rwRemaining)}*\n`
response += `ⴵ Claim » *${formatTime(claimRemaining)}*\n`
response += `ⴵ Vote » *${formatTime(voteRemaining)}*\n\n`
response += `♡ Personajes reclamados » *${claimedCount} / ${allCharacters.length}*\n`
response += `✰ Valor total » *${totalValue.toLocaleString('es-ES')}*`
await conn.reply(m.chat, response, m)
} catch (e) {
console.error(e)
await conn.reply(m.chat, '✘ Ocurrió un error al verificar tu estado.', m)
}
}
handler.help = ['estado', 'status', 'cooldowns', 'cd']
handler.tags = ['info']
handler.command = ['infogacha', 'ginfo', 'gachainfo']
handler.group = true
handler.register = true
export default handler