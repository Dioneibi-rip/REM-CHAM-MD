let handler = async (m, { conn, args }) => {
  if (!args[0]) return conn.reply(m.chat, '❯❯〘 ⚠️ ¡Necesitas proporcionar un nombre de usuario de Instagram! ⚠️〙❮❮', m);

  try {
    await conn.sendMessage(m.chat, { react: { text: `🙇🏻‍♀️`, key: m.key } });

    const apiUrl = `https://okarun-api.com.br/api/instagram/user?username=${args[0]}&apikey=Suakey`;
    const response = await fetch(apiUrl).then(res => res.json());

    if (response && response.status && response.resultado) {
      const data = response.resultado;

      const texto = `
❯❯ ${conn.user.name} - INSTAGRAM STALK ❮❮

*❒᭄➭ Nombre de usuario:* ${data.usuario}
*❒᭄➭ Nombre completo:* ${data.nome || 'No informado'}
*❒᭄➭ Publicaciones:* ${data.publicacoes || 0}
*❒᭄➭ Seguidores:* ${data.seguidores || 0}
*❒᭄➭ Siguiendo:* ${data.seguindo || 0}
*❒᭄➭ Biografía:* ${data.bio || 'No disponible'}
*❒᭄➭ Categoría:* ${data.categoria || 'No disponible'}
*❒᭄➭ Cuenta verificada:* ${data.verificado ? 'Sí' : 'No'}
*❒᭄➭ Tasa de engagement:* ${data.taxa_engajamento ? data.taxa_engajamento + '%' : 'No disponible'}
*❒᭄➭ Media de me gusta:* ${data.media_curtidas || 0}
*❒᭄➭ Media de comentarios:* ${data.media_comentarios || 0}

*❒᭄➭ Creador de la API:* ${response.criador || 'No informado'}
`;

      await conn.sendMessage(m.chat, {
        image: { url: data.foto_perfil },
        caption: texto,
      }, { quoted: m });

    } else {
      await conn.sendMessage(m.chat, {
        text: `❯❯〘 ⚠️ No se pudo encontrar información para este usuario. ⚠️〙❮❮\n\n🪪 Estado de la API: ${response?.status}\n🛑 Mensaje: ${response?.message || 'Respuesta vacía o inesperada'}`
      }, { quoted: m });
    }

  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, {
      text: `❯❯〘 ⚠️ Ocurrió un error al intentar obtener los datos del Instagram. ⚠️〙❮❮\n\n❌ *Error:* ${error.message}`
    }, { quoted: m });
  }
};

handler.help = ['igstalk <usuario>'];
handler.tags = ['stalker'];
handler.command = ['igstalk'];

export default handler;
