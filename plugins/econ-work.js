import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {

  let user = global.db.data.users[m.sender]
  if (!user.credit) user.credit = 0
  if (!user.bank) user.bank = 0

  let cooldown = 600000 
  let time = user.lastwork + cooldown

  if (new Date - user.lastwork < cooldown)
    throw `⏱️ 𝙉𝙤 𝙥𝙪𝙚𝙙𝙚𝙨 𝙩𝙧𝙖𝙗𝙖𝙟𝙖𝙧 𝙝𝙖𝙨𝙩𝙖 ${msToTime(time - new Date())}`

  const didWin = Math.random() < 0.8 // 80% ganar
  const base = Math.floor(Math.random() * 4000 + 500)

  if (didWin) {
    let gain = base
    user.credit += gain
    let work = pickRandom(trabajosBuenos)
    m.reply(`‣ ${work}\nGanaste *${gain.toLocaleString()} ${m.moneda}*\n\n💰 Cartera: *${user.credit.toLocaleString()}* | 🏦 Banco: *${user.bank.toLocaleString()}*`)
  } else {
    let loss = Math.floor(base / 1.5)
    let total = user.credit + user.bank
    let resta = Math.min(total, loss)

    if (user.credit >= resta) {
      user.credit -= resta
    } else {
      let falta = resta - user.credit
      user.credit = 0
      user.bank = Math.max(0, user.bank - falta)
    }

    let work = pickRandom(trabajosMalos)
    m.reply(`‣ ${work}\nPerdiste 🥀 *${resta.toLocaleString()} ${m.moneda}*\n\n💰 Cartera: *${user.credit.toLocaleString()}* | 🏦 Banco: *${user.bank.toLocaleString()}*`)
  }

  user.lastwork = new Date * 1
}

handler.help = ['work', 'chamba', 'chambear', 'trabajar']
handler.tags = ['economy']
handler.command = ['work', 'w', 'chamba', 'chambear', 'trabajar']
handler.register = true
handler.group = true

export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100)
  var seconds = Math.floor((duration / 1000) % 60)
  var minutes = Math.floor((duration / (1000 * 60)) % 60)
  var hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return minutes + " minutos " + seconds + " segundos"
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const trabajosBuenos = [
  "💻 Programaste un bot para WhatsApp y te pagaron una buena suma.",
  "🎨 Dibujaste un fanart de tu waifu y alguien lo compró en NFT.",
  "📱 Reparaste el celular de una chica y te dio propina (y su número).",
  "🎮 Ganaste un torneo de Free Fire y te llevaste el premio mayor.",
  "🎤 Hiciste un cover de anime y se volvió viral en TikTok.",
  "📦 Vendiste figuras de anime en un evento otaku.",
  "📸 Tomaste fotos profesionales en una convención y te pagaron bien.",
  "🍣 Trabajaste en un restaurante japonés y te dieron propina extra.",
  "🎧 Mezclaste música lo-fi para un canal de YouTube.",
  "💎 Fuiste minero en Minecraft y vendiste tus diamantes.",
  "🧠 Hackeaste un servidor (de prueba 😅) y ganaste una recompensa.",
  "🛠️ Arreglaste la PC de tu amigo gamer y te pagó en efectivo.",
  "📗 Tradujiste un manga y te dieron una buena donación.",
  "🚗 Hiciste delivery de ramen express sin accidentes.",
  "🏪 Atendiste una tienda de figuras y los clientes fueron generosos.",
  "💡 Diseñaste un logo para un streamer y te pagaron bien.",
  "🧋 Vendiste bubble tea frente a una escuela y te fue genial.",
  "📦 Entregaste paquetes sin perder ninguno (¡milagro!).",
  "🐾 Cuidaste al gato de una modelo y te dejó propina kawaii.",
  "🎲 Fuiste maestro de rol en una partida y te dieron propina épica."
]

const trabajosMalos = [
  "💀 Te estafaron intentando comprar Robux con descuento.",
  "💸 Perdiste tu cartera mientras hacías entregas.",
  "🥲 Tu jefe descubrió que usas el WiFi para ver anime.",
  "🚫 Fuiste despedido por dormirte en el trabajo.",
  "📉 Invertiste en Dogecoin justo antes de que se desplomara.",
  "🤡 Fuiste a trabajar y te olvidaste de ponerte los pantalones.",
  "📱 Rompiste el celular de un cliente al intentar arreglarlo.",
  "🚴‍♂️ Chocaste haciendo delivery y tu pedido voló.",
  "🍜 Intentaste vender ramen y nadie compró.",
  "🐕 Te mordió un perro mientras hacías un pedido.",
  "🎮 Perdiste tu trabajo por estar jugando Genshin Impact en horario laboral.",
  "🪙 Te dieron cambio falso en la tienda.",
  "📦 Confundiste una entrega y te descontaron del sueldo.",
  "🧾 Te cobraron impuestos por error y nadie te devolvió el dinero.",
  "💢 Te caíste en público mientras repartías volantes.",
  "📉 Apostaste tus ganancias en un gacha... y perdiste todo.",
  "🚪 Cerraste la puerta de la tienda con las llaves adentro.",
  "🧹 Te mandaron a limpiar los baños por llegar tarde.",
  "😵 Te robaron mientras ibas a depositar el dinero.",
  "🎭 Intentaste hacerte influencer, pero solo ganaste deudas."
]
