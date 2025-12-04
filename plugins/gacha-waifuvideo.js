import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'

// Función para corregir enlaces rotos o indirectos
function formatUrl(url) {
    if (!url) return url
    
    // 1. Corregir enlaces de GitHub que apuntan al visor web (/blob/) en lugar del archivo raw
    if (url.includes('github.com') && url.includes('/blob/')) {
        return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
    }
    
    // 2. Corregir enlaces de Tenor que a veces dan problemas si no terminan en extensión de archivo
    // (Opcional, pero ayuda si usas la API de tenor, aunque aquí asumimos enlaces directos)
    
    return url.trim()
}

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('❀ No se pudo cargar el archivo characters.json.')
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

let handler = async (m, { conn, command, args }) => {
    if (args.length === 0) {
        await conn.reply(m.chat, `《✧》Por favor, proporciona el nombre de un personaje.`, m)
        return
    }

    const characterName = args.join(' ').toLowerCase().trim()

    try {
        const characters = await loadCharacters()
        // Buscamos el personaje (convirtiendo ambos a minúsculas para evitar errores)
        const character = characters.find(c => c.name.toLowerCase() === characterName)

        if (!character) {
            await conn.reply(m.chat, `《✧》No se ha encontrado el personaje *${characterName}*. Asegúrate de que el nombre esté correcto.`, m)
            return
        }

        if (!character.vid || character.vid.length === 0) {
            await conn.reply(m.chat, `《✧》No se encontró un video para *${character.name}*.`, m)
            return
        }

        // Seleccionar video al azar
        let randomVideo = character.vid[Math.floor(Math.random() * character.vid.length)]
        
        // --- PASO CRITICO: LIMPIEZA DE URL ---
        const cleanUrl = formatUrl(randomVideo)

        const message = `❀ Nombre » *${character.name}*
⚥ Género » *${character.gender}*
❖ Fuente » *${character.source}*`

        // --- LÓGICA DE DETECCIÓN DE TIPO ---
        // Si el link termina en .gif o viene de Tenor/Pinterest y parece un gif, forzamos gifPlayback
        const isGif = cleanUrl.endsWith('.gif') || 
                      cleanUrl.includes('.gif') || 
                      cleanUrl.includes('tenor.com') ||
                      cleanUrl.includes('pinimg.com') 

        // Enviamos el mensaje
        await conn.sendMessage(m.chat, { 
            video: { url: cleanUrl }, 
            caption: message,
            // Si es un GIF, OBLIGAMOS gifPlayback: true. Si es MP4, lo dejamos opcional o false.
            // Esto soluciona el error de "falla en reproducción" en archivos .gif
            gifPlayback: isGif 
        }, { quoted: m })

    } catch (error) {
        console.error(error) // Útil para ver el error real en la consola
        await conn.reply(m.chat, `✘ Error al cargar el video del personaje. Verifica que los enlaces en el JSON sean directos (raw).`, m)
    }
}

handler.help = ['wvideo <nombre del personaje>']
handler.tags = ['anime']
handler.command = ['charvideo', 'wvideo', 'waifuvideo']
handler.group = true

export default handler