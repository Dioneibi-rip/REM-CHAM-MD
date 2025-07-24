const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const senderNum = sender.replace(/[^0-9]/g, "");
  const isOwner = global.owner.some(([id]) => id === senderNum);
  const isFromMe = msg.key.fromMe;

  if (!chatId.endsWith("@g.us")) {
    return conn.sendMessage(chatId, { text: "❌ Este comando solo puede usarse en grupos." }, { quoted: msg });
  }

  const meta = await conn.groupMetadata(chatId);
  const isAdmin = meta.participants.find(p => p.id === sender)?.admin;

  if (!isAdmin && !isOwner && !isFromMe) {
    return conn.sendMessage(chatId, {
      text: "❌ Solo *admins* o *el dueño del bot* pueden usar este comando."
    }, { quoted: msg });
  }

  const horaTexto = args.join(" ").trim();
  if (!horaTexto) {
    return conn.sendMessage(chatId, {
      text: "✳️ Usa el comando así:\n*.4vs4 [hora]*\nEjemplo: *.4vs4 21:00*"
    }, { quoted: msg });
  }

  await conn.sendMessage(chatId, { react: { text: '⚔️', key: msg.key } });

  const to24Hour = (str) => {
    let [time, modifier] = str.toLowerCase().split(/(am|pm)/);
    let [h, m] = time.split(":").map(n => parseInt(n));
    if (modifier === 'pm' && h !== 12) h += 12;
    if (modifier === 'am' && h === 12) h = 0;
    return { h, m: m || 0 };
  };

  const to12Hour = (h, m) => {
    const suffix = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, '0')}${suffix}`;
  };

  const base = to24Hour(horaTexto);

  const zonas = [
    { pais: "🇲🇽 MÉXICO", offset: 0 },
    { pais: "🇨🇴 COLOMBIA", offset: 0 },
    { pais: "🇵🇪 PERÚ", offset: 0 },
    { pais: "🇵🇦 PANAMÁ", offset: 0 },
    { pais: "🇸🇻 EL SALVADOR", offset: 0 },
    { pais: "🇵🇾 PARAGUAY", offset: 1 },
    { pais: "🇨🇱 CHILE", offset: 2 },
    { pais: "🇦🇷 ARGENTINA", offset: 2 },
    { pais: "🇪🇸 ESPAÑA", offset: 7 }
  ];

  const horaMsg = zonas.map(z => {
    let newH = base.h + z.offset;
    if (newH >= 24) newH -= 24;
    return `${z.pais} : ${to12Hour(newH, base.m)}`;
  }).join("\n");

  const participantes = meta.participants.filter(p => p.id !== conn.user.id);

  if (participantes.length < 8) {
    return conn.sendMessage(chatId, {
      text: "⚠️ Se necesitan al menos *8 usuarios* para formar 2 escuadras con suplentes."
    }, { quoted: msg });
  }

  const mensajeReaccion = `*🔥 4 VS 4 - ESCUADRAS 🔥*\n\n⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎\n${horaMsg}\n\n➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: 🔫 Clásico\n\nPara estar en escuadra reacciona ❤\nPara ser suplente reacciona 👍🏻`;

  const tempMsg = await conn.sendMessage(chatId, {
    text: mensajeReaccion,
    mentions: participantes.map(p => p.id)
  }, { quoted: msg });

  let escuadra = [];
  let suplentes = [];

  const actualizarEquipos = async () => {
    const textoFinal = `*🔥 4 VS 4 - ESCUADRAS 🔥*\n\n⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎\n${horaMsg}\n\n➥ 𝐄𝐒𝐂𝐔𝐀𝐃𝐑𝐀:\n${escuadra.map((u, i) => `${i === 0 ? "👑" : "🥷🏻"} ┇ @${u.split("@")[0]}`).join("\n")}\n\n➥ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:\n${suplentes.map((u, i) => `🧑‍🦲 ┇ @${u.split("@")[0]}`).join("\n")}\n\nPara estar en escuadra reacciona ❤\nPara ser suplente reacciona 👍🏻`;
    await conn.sendMessage(chatId, {
      edit: tempMsg.key,
      text: textoFinal,
      mentions: [...escuadra, ...suplentes]
    });
  };

  conn.on('message-reaction', async (reaction) => {
    if (reaction.key.id !== tempMsg.key.id) return;
    const userId = reaction.key.participant || reaction.key.remoteJid;
    if (reaction.text === "❤") {
      if (!escuadra.includes(userId) && escuadra.length < 4) {
        escuadra.push(userId);
        suplentes = suplentes.filter(u => u !== userId);
      }
    }
    if (reaction.text === "👍🏻") {
      if (!suplentes.includes(userId) && suplentes.length < 4) {
        suplentes.push(userId);
        escuadra = escuadra.filter(u => u !== userId);
      }
    }
    await actualizarEquipos();
  });
};

handler.command = ['4vs4'];
module.exports = handler;