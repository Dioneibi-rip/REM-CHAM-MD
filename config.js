// ────────╮
// Configuración global
// ╰─────────────────────────────────────────────╮
import { watchFile, unwatchFile } from 'fs';
import { fileURLToPath } from 'url';
import fs from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';
import axios from 'axios';

// ───────╮
// Variables globales
// ╰─────────────────────────────────────────────╮
global.owner = [
// <-- Número @s.whatsapp.net -->
  ['18294868853', '⏤͟͞ू⃪ ፝͜⁞𝘿𝙞𝙤𝙣𝙚𝙞𝙗𝙞-ʳⁱᵖ ִֶ ࣪˖ ִֶָ🐇་༘', true],
  ['18096758983', '⟆⃝༉⃟⸙ ᯽ N͙e͙v͙i͙-D͙e͙v͙ ⌗⚙️࿐', true],
  ['526671548329', 'ू⃪ ꒰˘͈ᵕ ˘͈ 𝑳𝒆𝒈𝒏𝒂-𝒄𝒉𝒂𝒏 🪽 ꒱𖦹', true],

// <-- Número @lid -->
  ['200141197844495', 'Dioneibi', true],
  ['260081845334105', 'nevi', true],
  ['58566677377081', 'legna', true]
];

global.mods = ['']; 
global.prems = ['']; 
global.allowed = ['519130645', '5164564565', '5191364564'];
global.keysZens = ['c2459db922', '37CC845916', '6fb0eff124'];
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())];
global.keysxteammm = [
  '29d4b59a4aa687ca', 
  '5LTV57azwaid7dXfz5fzJu', 
  'cb15ed422c71a2fb', 
  '5bd33b276d41d6b4', 
  'HIRO', 
  'kurrxd09', 
  'ebb6251cc00f9c63'
];
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())];
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5'];
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())];
global.lolkeysapi = ['GataDiosV2'];

// ────╮
// APIs
// ╰─────────────────────────────────────────────╮
global.APIs = {
  xteam: 'https://api.xteam.xyz',
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api-fgmods.ddns.net'
};

// ─────────────╮
// Claves de API
// ╰─────────────────────────────────────────────╮
global.APIKeys = {
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id': `${keysneoxr}`,
  'https://violetics.pw': 'beta',
  'https://zenzapis.xyz': `${keysxxx}`,
  'https://api-fgmods.ddns.net': 'fg-dylux'
};

// ─────────────╮
// Otras variables globales
// ╰─────────────────────────────────────────────╮
global.id_canal = '120363323192692909@newsletter'
global.name_canal = '𝐑𝐄𝐌 - 𝐁𝐎𝐓 - 𝐁𝐘 - 𝐂𝐔𝐑𝐈'
global.rcanal = 'https://whatsapp.com/channel/0029VaqEpTQBPzjbuTwGDN1U'
global.canal = 'https://whatsapp.com/channel/0029VaqEpTQBPzjbuTwGDN1U'
global.botname = '𝚁𝙴𝙼-𝙲𝙷𝙰𝙼';
global.premium = 'true';
global.packname = 'ʀᴇᴍ ᴄʜᴀᴍ ᴍᴅ';
global.author = 'GabrielCuri';
global.menuvid = 'https://telegra.ph/file/c92cd247a11a336199650.mp4';
global.igfg = '▢ Sigueme en Instagram\nhttps://www.instagram.com/Josecurisoto\n';
global.dygp = 'https://chat.whatsapp.com/BFfD1C0mTDDDfVdKPkxRAA';
global.fgsc = 'https://github.com/davidprospero123/REM-CHAM-MD';
global.fgyt = 'https://youtube.com/@holabb123';
global.fgpyp = 'https://youtube.com/@holabb123';
global.fglog = 'https://raw.githubusercontent.com/davidprospero123/REM-CHAM-MD/main/logo.jpg';
global.thumb = fs.readFileSync('./Assets/Remlogo.jpg');
global.wait = '*⌛ _𝘾𝘼𝙍𝙂𝘼𝙉𝘿𝙊..._*\n*▰▰▰▱▱▱▱▱*';
global.rwait = '⌛';
global.dmoji = '🤭';
global.done = '✅';
global.error = '❌';
global.xmoji = '🔥';
global.multiplier = 69;
global.maxwarn = '3';

// ──────────────────────────────────────────────╮
// Ruta del archivo actual
// ──────────────────────────────────────────────╯
let file = fileURLToPath(import.meta.url);

// ──────────────────────────────────────────────╮
// Vigilar cambios en el archivo
// ──────────────────────────────────────────────╯
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  import(`${file}?update=${Date.now()}`);
});
