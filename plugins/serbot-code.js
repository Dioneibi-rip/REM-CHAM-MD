import pkg from "@whiskeysockets/baileys";
import moment from "moment-timezone";
import NodeCache from "node-cache";
import readline from "readline";
import qrcode from "qrcode";
import crypto from "crypto";
import fs from "fs";
import pino from "pino";
import * as ws from "ws";
import path from "path";
const { CONNECTING } = ws;
import { Boom } from "@hapi/boom";
import { makeWASocket } from "../lib/simple.js";

const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  PHONENUMBER_MCC,
} = pkg;

if (!Array.isArray(global.conns)) global.conns = [];

const mssg = {
  nobbot: "𝙽𝚘 𝚙𝚞𝚎𝚍𝚎𝚜 𝚞𝚜𝚊𝚛 𝚎𝚕 𝚋𝚘𝚝 𝚛𝚎𝚖.",
  recon: "𝚁𝙴𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙽𝙳𝙾 𝚁𝙴𝙼 𝙱𝙾𝚃",
  sesClose: "𝙻𝙰 𝚂𝙴𝚂𝚂𝙸𝙾𝙽 𝙵𝚄𝙴 𝙲𝙴𝚁𝚁𝙰𝙳𝙰",
  botinfo:
    `𝚄𝚂𝙰 𝙴𝚂𝚃𝙴 𝙲𝙾𝙳𝙸𝙶𝙾 𝙿𝙰𝚁𝙰 𝚂𝙴𝚁 𝚂𝚄𝙱 𝙱𝙾𝚃.\n\n` +
    "> `𝙶𝚄𝙸𝙰:` \n" +
    "> `1` : 𝙷𝚊𝚐𝚊 𝚌𝚕𝚒𝚌𝚔 𝚎𝚗 𝚕𝚘𝚜 𝟹 𝚙𝚞𝚗𝚝𝚘𝚜\n" +
    "> `2` : 𝚃𝚘𝚚𝚞𝚎 𝚍𝚒𝚜𝚙𝚘𝚜𝚒𝚝𝚒𝚟𝚘𝚜 𝚟𝚒𝚗𝚌𝚞𝚕𝚊𝚍𝚘𝚜\n" +
    "> `3` : 𝚂𝚎𝚕𝚎𝚌𝚌𝚒𝚘𝚗𝚊 𝚅𝚒𝚗𝚌𝚞𝚕𝚊𝚛 𝚌𝚘𝚗 𝚎𝚕 𝚗ú𝚖𝚎𝚛𝚘 𝚍𝚎 𝚝𝚎𝚕é𝚏𝚘𝚗𝚘\n" +
    "> `4` : 𝙴𝚜𝚌𝚛𝚒𝚋𝚊 𝚎𝚕 𝙲𝚘𝚍𝚒𝚐𝚘\n\n" +
    "`Nota :` 𝙴𝚜𝚝𝚎 𝙲ó𝚍𝚒𝚐𝚘 𝚜𝚘𝚕𝚘 𝚏𝚞𝚗𝚌𝚒𝚘𝚗𝚊 𝚎𝚗 𝚎𝚕 𝚗ú𝚖𝚎𝚛𝚘 𝚚𝚞𝚎 𝚕𝚘 𝚜𝚘𝚕𝚒𝚌𝚒𝚝𝚘",
  connet: "𝙲𝙾𝙽𝙴𝚇𝙸𝙾𝙽 𝙴𝚂𝚃𝙰𝙱𝙻𝙴𝙲𝙸𝙳𝙰 𝙲𝙾𝙽 𝙴𝚇𝙸𝚃𝙾",
  connID: "𝙲𝙾𝙽𝙴𝚇𝙸𝙾𝙽 𝙴𝚂𝚃𝙰𝙱𝙻𝙴𝙲𝙸𝙳𝙰 𝙲𝙾𝙽 𝙴𝚇𝙸𝚃𝙾",
  connMsg:
    "𝚁𝙴𝙲𝚄𝙴𝚁𝙳𝙴 𝙶𝚄𝙰𝚁𝙳𝙰𝚁 𝙴𝚂𝚃𝙴 𝙲𝙾𝙳𝙸𝙶𝙾 𝚀𝚄𝙴 𝙻𝙴 𝙼𝙰𝙽𝙳𝙰𝚁𝙴 𝙿𝙰𝚁𝙰 𝙲𝚄𝙰𝙽𝙳𝙾\n" +
    "𝙴𝙻 𝚂𝚄𝙱 𝙱𝙾𝚃 𝚂𝙴 𝚁𝙴𝙸𝙽𝙸𝙲𝙸𝙴 𝙿𝚄𝙴𝙳𝙰𝚂\n" +
    "𝚂𝙴𝚁 𝙾𝚃𝚁𝙰 𝚅𝙴𝚉 𝙱𝙾𝚃 𝙵𝙰𝙲𝙸𝙻𝙼𝙴𝙽𝚃𝙴\n" +
    "𝚂𝙸 𝙴𝙻 𝙱𝙾𝚃 𝚁𝙴𝙲𝙸𝙱𝙴 𝙼𝚄𝙲𝙷𝙾 𝙰𝙿𝙾𝚈𝙾 𝙿𝙾𝙽𝙳𝚁𝙴 𝙴𝙻 𝙱𝙾𝚃 𝙲𝙾𝙽 𝚁𝙴𝙲𝙾𝙽𝙴𝚇𝙸𝙾𝙽 𝙰𝚄𝚃𝙾𝙼𝙰𝚃𝙸𝙲𝙰",
  rembot: "`𝚁𝙴𝙼-𝙲𝙷𝙰𝙼 𝙱𝚈 𝙶𝙰𝙱𝚁𝙸𝙴𝙻 - 𝙹𝚃𝚡𝚜`",
};

let handler = async (
  m,
  { conn: _conn, args, usedPrefix, command, isOwner },
) => {
  let parent = _conn;

  if (global.conns.length >= 90) {
    return parent.sendMessage(
      m.chat,
      { text: `No se han encontrado espacios para *Sub-Bots* disponibles.` },
      { quoted: m }
    );
  }

  if (!global.db?.data?.users) global.db = { data: { users: {} } };
  let user = global.db.data.users[m.sender] || {};
  let last = user.Subs || 0;
  if (Date.now() - last < 120_000) {
    return parent.sendMessage(
      m.chat,
      { text: `Debes esperar ${Math.ceil((120_000 - (Date.now() - last)) / 1000)} segundos para volver a vincular un Sub-Bot.` },
      { quoted: m }
    );
  }
  user.Subs = Date.now();
  global.db.data.users[m.sender] = user;

  async function rembots() {
    let authFolderB = crypto.randomBytes(10).toString("hex").slice(0, 8);
    const folderPath = "./rembots/" + authFolderB;

    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    if (args[0]) {
      try {
        fs.writeFileSync(
          folderPath + "/creds.json",
          JSON.stringify(
            JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")),
            null,
            "\t",
          ),
        );
      } catch (e) {
        return parent.sendMessage(m.chat, { text: "❌ Error con el código. Inténtalo de nuevo." }, { quoted: m });
      }
    }

    const { state, saveState, saveCreds } = await useMultiFileAuthState(folderPath);
    const msgRetryCounterCache = new NodeCache();
    const { version } = await fetchLatestBaileysVersion();
    let phoneNumber = m.sender.split("@")[0];

    const methodCode = !!phoneNumber || process.argv.includes("code");

    const connectionOptions = {
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      mobile: false,
      browser: ["Ubuntu", "Chrome", "20.0.04", "REM-BOT"],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: "fatal" }).child({ level: "fatal" }),
        ),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async (clave) => {
        let jid = jidNormalizedUser(clave.remoteJid);
        let msg = await store.loadMessage(jid, clave.id);
        return msg?.message || "";
      },
      msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined,
      version,
    };

    let conn = makeWASocket(connectionOptions);
    conn.isInit = false;
    let isInit = true;

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update;
      const reason =
        lastDisconnect?.error?.output?.statusCode ||
        lastDisconnect?.error?.output?.payload?.statusCode;

      if (isNewLogin) conn.isInit = true;

      if (connection === 'close') {
        if ([428, 408, 500, 515].includes(reason)) {
          await creloadHandler(true).catch(console.error);
        }
        if ([440].includes(reason)) {
          parent.sendMessage(
            m.chat,
            { text: "*HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*" },
            { quoted: m }
          );
          try { fs.rmSync(folderPath, { recursive: true, force: true }); } catch { }
        }
        if ([401, 405, 403].includes(reason)) {
          parent.sendMessage(
            m.chat,
            { text: "*SESIÓN PENDIENTE O CREDENCIALES INVÁLIDAS*" },
            { quoted: m }
          );
          try { fs.rmSync(folderPath, { recursive: true, force: true }); } catch { }
        }
      }

      if (global.db.data == null) loadDatabase();

      if (connection == "open") {
        conn.isInit = true;
        global.conns.push(conn);
        await parent.sendMessage(
          m.chat,
          { text: args[0] ? `ᡣ𐭩 ${mssg.connet}` : `ᡣ𐭩 ${mssg.connID}` },
          { quoted: m },
        );
        await sleep(5000);
        if (args[0]) return;
        await parent.sendMessage(
          conn.user.jid,
          { text: `ᡣ𐭩 ${mssg.connMsg}` },
          { quoted: m },
        );
        parent.sendMessage(
          conn.user.jid,
          {
            text:
              usedPrefix +
              command +
              " " +
              Buffer.from(
                fs.readFileSync(folderPath + "/creds.json"),
                "utf-8",
              ).toString("base64"),
          },
          { quoted: m },
        );
   
        if (global.ch) {
          await joinChannels(conn);
        }
      }

      // Envío de código de 8 dígitos (igual que tu formato)
      if (methodCode && !conn.authState.creds.registered) {
        if (!phoneNumber) process.exit(0);
        let cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
        if (
          !Object.keys(PHONENUMBER_MCC).some((v) => cleanedNumber.startsWith(v))
        ) {
          process.exit(0);
        }
        setTimeout(async () => {
          let codeBot = await conn.requestPairingCode(cleanedNumber);
          codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
          parent.sendButton2(
            m.chat,
            `‹𝟹 𝙲𝙾𝙳𝙴: *${codeBot}*\n\n${mssg.botinfo}`,
            mssg.rembot,
            "https://i.ibb.co/0cdWZb5/105d0d0c0f05348828ee14fae199297c.jpg",
            [],
            codeBot,
            null,
            m,
          );
        }, 3000);
      }
    }

    // Limpieza periódica de sub-bots caídos
    setInterval(async () => {
      if (!conn.user || !conn.ws || conn.ws.readyState === ws.CLOSED) {
        try { conn.ws.close(); } catch {}
        conn.ev.removeAllListeners();
        let i = global.conns.indexOf(conn);
        if (i >= 0) {
          try { fs.rmSync(folderPath, { recursive: true, force: true }); } catch { }
          global.conns.splice(i, 1);
        }
      }
    }, 60000);

    let handler = await import("../handler.js");
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(
          `../handler.js?update=${Date.now()}`
        ).catch(console.error);
        if (Object.keys(Handler || {}).length) handler = Handler;
      } catch (e) { console.error(e); }
      if (restatConn) {
        try { conn.ws.close(); } catch {}
        conn.ev.removeAllListeners();
        conn = makeWASocket(connectionOptions);
        isInit = true;
      }

      if (!isInit) {
        conn.ev.off("messages.upsert", conn.handler);
        conn.ev.off("group-participants.update", conn.participantsUpdate);
        conn.ev.off("groups.update", conn.groupsUpdate);
        conn.ev.off("message.delete", conn.onDelete);
        conn.ev.off("call", conn.onCall);
        conn.ev.off("connection.update", conn.connectionUpdate);
        conn.ev.off("creds.update", conn.credsUpdate);
      }

      conn.welcome = global.conn.welcome + "";
      conn.bye = global.conn.bye + "";
      conn.spromote = global.conn.spromote + "";
      conn.sdemote = global.conn.sdemote + "";

      conn.handler = handler.handler.bind(conn);
      conn.participantsUpdate = handler.participantsUpdate.bind(conn);
      conn.groupsUpdate = handler.groupsUpdate.bind(conn);
      conn.onDelete = handler.deleteUpdate.bind(conn);
      conn.connectionUpdate = connectionUpdate.bind(conn);
      conn.credsUpdate = saveCreds.bind(conn, true);

      conn.ev.on("messages.upsert", conn.handler);
      conn.ev.on("group-participants.update", conn.participantsUpdate);
      conn.ev.on("groups.update", conn.groupsUpdate);
      conn.ev.on("message.delete", conn.onDelete);
      conn.ev.on("connection.update", conn.connectionUpdate);
      conn.ev.on("creds.update", conn.credsUpdate);
      isInit = false;
      return true;
    };
    creloadHandler(false);
  }

  // Auto-follow canales oficiales
  async function joinChannels(conn) {
    for (const channelId of Object.values(global.ch || {})) {
      await conn.newsletterFollow(channelId).catch(() => {});
    }
  }

  rembots();
};

handler.help = ["botclone"];
handler.tags = ["serbot"];
handler.command = ["code", "serbotcode", "jadibotcode"];
handler.rowner = false;
handler.register = true;
export default handler;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}