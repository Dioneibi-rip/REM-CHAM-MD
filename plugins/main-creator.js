import { Sticker, StickerTypes } from 'wa-sticker-formatter';

async function handler(m, { conn }) {
  m.react('🧩');

  const contactos = [
    {
      numero: '18294868853',
      nombre: '⏤͟͞ू⃪ ፝͜⁞𝘿𝙞𝙤𝙣𝙚𝙞𝙗𝙞 👑',
      cargo: 'Dueño Principal',
      nota: 'Creador del Bot',
      correo: 'selinapasena@gmail.com',
      region: '🇩🇴 República Dominicana',
      web: 'https://github.com/Dioneibi-rip',
      biografia: await conn.fetchStatus('18294868853@s.whatsapp.net').then(res => res.status).catch(_ => 'Sin biografía')
    },
    {
      numero: '18096758983',
      nombre: '⟆⃝༉⃟⸙ N͙e͙v͙i͙-D͙e͙v ⌗⚙️',
      cargo: 'Desarrollador y ayudante',
      nota: 'Soporte Técnico',
      correo: 'sin información',
      region: '🇩🇴 República Dominicana',
      web: 'https://github.com/nevi-dev',
      biografia: await conn.fetchStatus('18096758983@s.whatsapp.net').then(res => res.status).catch(_ => 'Sin biografía')
    },
    {
      numero: '5216671548329',
      nombre: '꒰˘͈ᵕ ˘͈ 𝑳𝒆𝒈𝒏𝒂-𝒄𝒉𝒂𝒏 🪽꒱',
      cargo: 'Co-Desarrolladora y contribudora',
      nota: 'Resolución de problemas',
      correo: 'sin información',
      region: '🇲🇽 México',
      web: 'https://github.com/Legna-chan',
      biografia: await conn.fetchStatus('5216671548329@s.whatsapp.net').then(res => res.status).catch(_ => 'Sin biografía')
    }
  ];

  for (const contacto of contactos) {
    const jid = `${contacto.numero}@s.whatsapp.net`;

    // Obtener imagen de perfil
    let ppUrl = await conn.profilePictureUrl(jid, 'image').catch(_ => null);
    if (!ppUrl) continue;

    // Crear sticker con descripción
    const infoTexto = `
👤 *Nombre:* ${contacto.nombre}
🛠️ *Cargo:* ${contacto.cargo}
📌 *Nota:* ${contacto.nota}
📧 *Correo:* ${contacto.correo}
🌍 *Región:* ${contacto.region}
🔗 *Web:* ${contacto.web}
📝 *Bio:* ${contacto.biografia}
`.trim();

    const sticker = new Sticker(ppUrl, {
      pack: 'Colaboradores del Bot',
      author: contacto.nombre,
      type: StickerTypes.FULL,
      categories: ['👑', '🛠️'],
      id: contacto.numero,
      quality: 70,
    });

    await conn.sendMessage(m.chat, await sticker.toMessage(), { quoted: m });
    await conn.sendMessage(m.chat, { text: infoTexto }, { quoted: m });
  }
}

handler.help = ['owner', 'creator', 'creador'];
handler.tags = ['info'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
