import { smsg } from "./lib/simple.js";
import { format } from "util";
import { fileURLToPath } from "url";
import path, { join } from "path";
import { unwatchFile, watchFile } from "fs";
import chalk from "chalk";
import fetch from "node-fetch";
import Pino from "pino";

/**
 * @type {import("@whiskeysockets/baileys")}
 */
const isNumber = (x) => typeof x === "number" && !isNaN(x);
const delay = (ms) =>
  isNumber(ms) &&
  new Promise((resolve) =>
    setTimeout(function () {
      clearTimeout(this);
      resolve();
    }, ms),
  );

const cleanJid = jid => jid?.split(':')[0] || '';
const normalizeJid = jid => jid?.replace(/[^0-9]/g, '');

/**
 * Manejo principal del mensaje
 */
const { getAggregateVotesInPollMessage, makeInMemoryStore } = await (
  await import("@whiskeysockets/baileys")
).default;
const store = makeInMemoryStore({
  logger: Pino().child({
    level: "fatal",
    stream: "store",
  }),
});
export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || [];
  if (!chatUpdate) return;
  this.pushMessage(chatUpdate.messages).catch(console.error);
  let m = chatUpdate.messages[chatUpdate.messages.length - 1];
  if (!m) return;
  if (global.db.data == null) await global.loadDatabase();
  try {
    m = smsg(this, m) || m;
    if (!m) return;
    m.exp = 0;
    m.credit = false;
    m.bank = false;
    m.chicken = false;

    let jid = cleanJid(m.sender);

    let user = global.db.data.users[jid];
    if (typeof user !== "object") {
      user = global.db.data.users[jid] = {
        exp: 0,
        credit: 10,
        bank: 0,
        chicken: 0,
        lastclaim: 0,
        registered: false,
        name: m.name,
        age: -1,
        regTime: -1,
        afk: -1,
        afkReason: "",
        banned: false,
        warn: 0,
        level: 0,
        role: "Nuevo",
        autolevelup: false,
      };
    } else {
      if (!isNumber(user.exp)) user.exp = 0;
      if (!isNumber(user.credit)) user.credit = 10;
      if (!isNumber(user.bank)) user.bank = 0;
      if (!isNumber(user.chicken)) user.chicken = 0;
      if (!isNumber(user.lastclaim)) user.lastclaim = 0;
      if (!("registered" in user)) user.registered = false;
      if (!user.registered) {
        if (!("name" in user)) user.name = m.name;
        if (!isNumber(user.age)) user.age = -1;
        if (!isNumber(user.regTime)) user.regTime = -1;
      }
      if (!isNumber(user.afk)) user.afk = -1;
      if (!("afkReason" in user)) user.afkReason = "";
      if (!("banned" in user)) user.banned = false;
      if (!isNumber(user.warn)) user.warn = 0;
      if (!isNumber(user.level)) user.level = 0;
      if (!("role" in user)) user.role = "Nuevo";
      if (!("autolevelup" in user)) user.autolevelup = false;
    }

    let chat = global.db.data.chats[m.chat];
    if (typeof chat !== "object") global.db.data.chats[m.chat] = {};
    if (chat) {
      if (!("antiDelete" in chat)) chat.antiDelete = true;
      if (!("antiLink" in chat)) chat.antiLink = true;
      if (!("antiSticker" in chat)) chat.antiSticker = false;
      if (!("antiToxic" in chat)) chat.antiToxic = false;
      if (!("detect" in chat)) chat.detect = false;
      if (!("getmsg" in chat)) chat.getmsg = true;
      if (!("isBanned" in chat)) chat.isBanned = false;
      if (!("nsfw" in chat)) chat.nsfw = false;
      if (!("sBye" in chat)) chat.sBye = "";
      if (!("sDemote" in chat)) chat.sDemote = "";
      if (!("simi" in chat)) chat.simi = false;
      if (!("sPromote" in chat)) chat.sPromote = "";
      if (!("sWelcome" in chat)) chat.sWelcome = "";
      if (!("useDocument" in chat)) chat.useDocument = false;
      if (!("viewOnce" in chat)) chat.viewOnce = false;
      if (!("viewStory" in chat)) chat.viewStory = false;
      if (!("welcome" in chat)) chat.welcome = true;
      if (!("chatbot" in chat)) chat.chatbot = false;
      if (!isNumber(chat.expired)) chat.expired = 0;
    } else
      global.db.data.chats[m.chat] = {
        antiDelete: true,
        antiLink: false,
        antiSticker: false,
        antiToxic: false,
        detect: false,
        expired: 0,
        getmsg: true,
        isBanned: false,
        nsfw: false,
        sBye: "",
        sDemote: "",
        simi: false,
        sPromote: "",
        sticker: false,
        sWelcome: "",
        useDocument: false,
        viewOnce: false,
        viewStory: false,
        welcome: false,
        chatbot: false,
      };

    let settings = global.db.data.settings[this.user.jid];
    if (typeof settings !== "object")
      global.db.data.settings[this.user.jid] = {};
    if (settings) {
      if (!("self" in settings)) settings.self = false;
      if (!("autoread" in settings)) settings.autoread = false;
      if (!("restrict" in settings)) settings.restrict = false;
      if (!("restartDB" in settings)) settings.restartDB = 0;
      if (!("status" in settings)) settings.status = 0;
    } else
      global.db.data.settings[this.user.jid] = {
        self: false,
        autoread: false,
        restrict: false,
        restartDB: 0,
        status: 0,
      };

    if (opts["nyimak"]) return;
    if (opts["pconly"] && m.chat.endsWith("g.us")) return;
    if (opts["gconly"] && !m.chat.endsWith("g.us")) return;
    if (opts["swonly"] && m.chat !== "status@broadcast") return;
    if (typeof m.text !== "string") m.text = "";

    const senderNum = normalizeJid(jid);
    const isROwner = [
      cleanJid(conn.decodeJid(global.conn.user.id)),
      ...global.owner.map(([number]) => number),
    ].map(v => normalizeJid(v)).includes(senderNum);
    const isOwner = isROwner || m.fromMe;
    const isMods = isOwner ||
      global.mods.map(v => normalizeJid(v)).includes(senderNum);
    const isPrems = isROwner ||
      global.prems.map(v => normalizeJid(v)).includes(senderNum);

    if (opts["queque"] && m.text && !(isMods || isPrems)) {
      let queque = this.msgqueque,
        time = 1000 * 5;
      const previousID = queque[queque.length - 1];
      queque.push(m.id || m.key.id);
      setInterval(async function () {
        if (queque.indexOf(previousID) === -1) clearInterval(this);
        await delay(time);
      }, time);
    }
    if (
      process.env.MODE &&
      process.env.MODE.toLowerCase() === "private" &&
      !(isROwner || isOwner)
    )
      return;

    if (m.isBaileys) return;
    m.exp += Math.ceil(Math.random() * 10);

    let usedPrefix;
    let _user = global.db.data.users[jid];

    const groupMetadata =
      (m.isGroup
        ? (conn.chats[m.chat] || {}).metadata ||
          (await this.groupMetadata(m.chat).catch((_) => null))
        : {}) || {};
    const participants = (m.isGroup ? groupMetadata.participants : []) || [];
    const groupUser =
      (m.isGroup
        ? participants.find(u => normalizeJid(cleanJid(u.id)) === senderNum)
        : {}) || {};
    const botNums = [this.user.jid, this.user.lid].map(j => normalizeJid(cleanJid(j)));
    const bot =
      (m.isGroup
        ? participants.find(u => botNums.includes(normalizeJid(cleanJid(u.id))))
        : {}) || {};
    const isRAdmin = groupUser?.admin == "superadmin" || false;
    const isAdmin = isRAdmin || groupUser?.admin == "admin" || false;
    const isBotAdmin = bot?.admin || false;

    const ___dirname = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "./plugins",
    );
    for (let name in global.plugins) {
      let plugin = global.plugins[name];
      if (!plugin) continue;
      if (plugin.disabled) continue;
      const __filename = join(___dirname, name);
      if (typeof plugin.all === "function") {
        try {
          await plugin.all.call(this, m, {
            chatUpdate,
            __dirname: ___dirname,
            __filename,
          });
        } catch (e) {
          console.error(e);
          for (let [jid] of global.owner.filter(
            ([number, _, isDeveloper]) => isDeveloper && number,
          )) {
            let data = (await conn.onWhatsApp(jid))[0] || {};
            if (data.exists)
              m.reply(
                `*🗂️ Plugin:* ${name}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${m.text}\n\n\${format(e)}`.trim(),
                data.jid,
              );
          }
        }
      }
      if (!opts["restrict"])
        if (plugin.tags && plugin.tags.includes("admin")) {
          continue;
        }
      const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
      let _prefix = plugin.customPrefix
        ? plugin.customPrefix
        : conn.prefix
          ? conn.prefix
          : global.prefix;
      let match = (
        _prefix instanceof RegExp
          ? [[_prefix.exec(m.text), _prefix]]
          : Array.isArray(_prefix)
            ? _prefix.map((p) => {
                let re =
                  p instanceof RegExp
                    ? p
                    : new RegExp(str2Regex(p));
                return [re.exec(m.text), re];
              })
            : typeof _prefix === "string"
              ? [
                  [
                    new RegExp(str2Regex(_prefix)).exec(m.text),
                    new RegExp(str2Regex(_prefix)),
                  ],
                ]
              : [[[], new RegExp()]]
      ).find((p) => p[1]);
      if (typeof plugin.before === "function") {
        if (
          await plugin.before.call(this, m, {
            match,
            conn: this,
            participants,
            groupMetadata,
            user: groupUser,
            bot,
            isROwner,
            isOwner,
            isRAdmin,
            isAdmin,
            isBotAdmin,
            isPrems,
            chatUpdate,
            __dirname: ___dirname,
            __filename,
          })
        )
          continue;
      }
      if (typeof plugin !== "function") continue;
      if ((usedPrefix = (match[0] || "")[0])) {
        let noPrefix = m.text.replace(usedPrefix, "");
        let [command, ...args] = noPrefix.trim().split` `.filter((v) => v);
        args = args || [];
        let _args = noPrefix.trim().split` `.slice(1);
        let text = _args.join` `;
        command = (command || "").toLowerCase();
        let fail = plugin.fail || global.dfail;
        let isAccept =
          plugin.command instanceof RegExp
            ? plugin.command.test(command)
            : Array.isArray(plugin.command)
              ? plugin.command.some((cmd) =>
                  cmd instanceof RegExp
                    ? cmd.test(command)
                    : cmd === command,
                )
              : typeof plugin.command === "string"
                ? plugin.command === command
                : false;
        if (!isAccept) continue;
        m.plugin = name;
        if (
          m.chat in global.db.data.chats ||
          jid in global.db.data.users
        ) {
          let chat = global.db.data.chats[m.chat];
          let user = global.db.data.users[jid];
          if (name != "owner-unbanchat.js" && chat?.isBanned) return;
          if (name != "owner-unbanuser.js" && user?.banned) return;
        }
        if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
          fail("owner", m, this);
          continue;
        }
        if (plugin.rowner && !isROwner) {
          fail("rowner", m, this);
          continue;
        }
        if (plugin.owner && !isOwner) {
          fail("owner", m, this);
          continue;
        }
        if (plugin.mods && !isMods) {
          fail("mods", m, this);
          continue;
        }
        if (plugin.premium && !isPrems) {
          fail("premium", m, this);
          continue;
        }
        if (plugin.group && !m.isGroup) {
          fail("group", m, this);
          continue;
        } else if (plugin.botAdmin && !isBotAdmin) {
          fail("botAdmin", m, this);
          continue;
        } else if (plugin.admin && !isAdmin) {
          fail("admin", m, this);
          continue;
        }
        if (plugin.private && m.isGroup) {
          fail("private", m, this);
          continue;
        }
        if (plugin.register == true && !_user.registered) {
          fail("unreg", m, this);
          continue;
        }
        m.isCommand = true;
        let xp = "exp" in plugin ? parseInt(plugin.exp) : 17;
        if (xp > 200) m.reply("cheater");
        else m.exp += xp;
        if (
          !isPrems &&
          plugin.credit &&
          global.db.data.users[jid].credit < plugin.credit * 1
        ) {
          this.reply(m.chat, `🟥 𝙽𝙾 𝙲𝚄𝙴𝙽𝚃𝙰𝚂 𝙲𝙾𝙽 𝙾𝚁𝙾`, m);
          continue;
        }
        if (plugin.level > _user.level) {
          this.reply(
            m.chat,
            `🟥 𝙽𝙸𝚅𝙴𝙻 𝚁𝙴𝚀𝚄𝙴𝚁𝙸𝙳𝙾 ${plugin.level} 𝙿𝙰𝚁𝙰 𝚄𝚂𝙰𝚁 𝙴𝚂𝚃𝙴 𝙲𝙾𝙼𝙰𝙽𝙳𝙾. \n𝚃𝚄 𝙽𝙸𝚅𝙴𝙻 ${_user.level}`,
            m,
          );
          continue;
        }
        let extra = {
          match,
          usedPrefix,
          noPrefix,
          _args,
          args,
          command,
          text,
          conn: this,
          participants,
          groupMetadata,
          user: groupUser,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          isPrems,
          chatUpdate,
          __dirname: ___dirname,
          __filename,
        };
        try {
          await plugin.call(this, m, extra);
          if (!isPrems) m.credit = m.credit || plugin.credit || false;
        } catch (e) {
          m.error = e;
          console.error(e);
          if (e) {
            let text = format(e);
            for (let key of Object.values(global.APIKeys))
              text = text.replace(new RegExp(key, "g"), "#HIDDEN#");
            if (e.name)
              for (let [jid] of global.owner.filter(
                ([number, _, isDeveloper]) => isDeveloper && number,
              )) {
                let data = (await this.onWhatsApp(jid))[0] || {};
                if (data.exists)
                  return m.reply(
                    `*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(" ")}\n📄 *Error Logs:*\n\n${text}`.trim(),
                    data.jid,
                  );
              }
            m.reply(text);
          }
        } finally {
          if (typeof plugin.after === "function") {
            try {
              await plugin.after.call(this, m, extra);
            } catch (e) {
              console.error(e);
            }
          }
          if (m.credit) m.reply(`𝚃𝚄 𝚄𝚂𝙰𝚂𝚃𝙴 *${+m.credit}*`);
        }
        break;
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    if (opts["queque"] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
      if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1);
    }
    let user,
      stats = global.db.data.stats;
    let jid = cleanJid(m?.sender);
    if (m && jid && (user = global.db.data.users[jid])) {
      user.exp += m.exp;
      user.credit -= m.credit * 1;
      user.bank -= m.bank;
      user.chicken -= m.chicken;
    }

    let stat;
    if (m && m.plugin) {
      let now = +new Date();
      if (m.plugin in stats) {
        stat = stats[m.plugin];
        if (!isNumber(stat.total)) stat.total = 1;
        if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1;
        if (!isNumber(stat.last)) stat.last = now;
        if (!isNumber(stat.lastSuccess))
          stat.lastSuccess = m.error != null ? 0 : now;
      } else
        stat = stats[m.plugin] = {
          total: 1,
          success: m.error != null ? 0 : 1,
          last: now,
          lastSuccess: m.error != null ? 0 : now,
        };
      stat.total += 1;
      stat.last = now;
      if (m.error == null) {
        stat.success += 1;
        stat.lastSuccess = now;
      }
    }

    try {
      if (!opts["noprint"])
        await (await import("./lib/print.js")).default(m, this);
    } catch (e) {
      console.log(m, m.quoted, e);
    }
    if (process.env.autoRead) await conn.readMessages([m.key]);
    if (process.env.statusview && m.key.remoteJid === "status@broadcast")
      await conn.readMessages([m.key]);
  }
}

/**
 * Handle groups participants update
 * @param {import("@whiskeysockets/baileys").BaileysEventMap<unknown>["group-participants.update"]} groupsUpdate
 */
export async function participantsUpdate({ id, participants, action }) {
  if (opts["self"] || this.isInit) return;
  if (global.db.data == null) await loadDatabase();
  const chat = global.db.data.chats[id] || {};
  const emoji = {
    promote: "👤👑",
    demote: "👤🙅‍♂️",
    welcome: "👋",
    bye: "👋",
    bug: "🐛",
    mail: "📮",
    owner: "👑",
  };

  switch (action) {
    case "add":
      if (chat.welcome) {
        let groupMetadata =
          (await this.groupMetadata(id)) || (conn.chats[id] || {}).metadata;
        for (let user of participants) {
          let pp, ppgp;
          try {
            pp = await this.profilePictureUrl(user, "image");
            ppgp = await this.profilePictureUrl(id, "image");
          } catch (error) {
            console.error(`Error retrieving profile picture: ${error}`);
            pp = "https://i.pinimg.com/564x/92/05/f0/9205f0b8b38e296f91cd09690a0ab3b2.jpg";
            ppgp = "https://i.pinimg.com/564x/92/05/f0/9205f0b8b38e296f91cd09690a0ab3b2.jpg";
          } finally {
            let text = (
              chat.sWelcome ||
              this.welcome ||
              conn.welcome ||
              "𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝙸𝙳𝙾, @user"
            )
              .replace("@group", await this.getName(id))
              .replace("@desc", groupMetadata.desc?.toString() || "error")
              .replace("@user", "@" + user.split("@")[0]);

            let nthMember = groupMetadata.participants.length;
            let secondText = `
╭───[ 𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝙸𝙳𝙾 ]───
│ 𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝙸𝙳𝙾, ${await this.getName(user)}, 𝙵𝙴𝙻𝙸𝙲𝙸𝙳𝙰𝙳 𝚀𝚄𝙴 ${nthMember}𝙼𝙴𝙼𝙱𝚁𝙾
│
│ 𝙱𝚒𝚎𝚗𝚟𝚎𝚗𝚒𝚍𝚘 𝚊 𝚎𝚜𝚝𝚊 𝚑𝚞𝚖𝚒𝚕𝚍𝚎 𝚏𝚊𝚖𝚒𝚕𝚒𝚊 :3
╰────────═┅═────────`;

            let welcomeApiUrl = `https://i.pinimg.com/564x/92/05/f0/9205f0b8b38e296f91cd09690a0ab3b2.jpg${encodeURIComponent(
              await this.getName(user),
            )}&guildName=${encodeURIComponent(await this.getName(id))}&guildIcon=${encodeURIComponent(
              ppgp,
            )}&memberCount=${encodeURIComponent(
              nthMember.toString(),
            )}&avatar=${encodeURIComponent(pp)}&background=${encodeURIComponent(
              "https://telegra.ph/file/72084f63fee4d5152b2f4.jpg",
            )}`;

            try {
              let welcomeResponse = await fetch(welcomeApiUrl);
              let welcomeBuffer = await welcomeResponse.buffer();

              this.sendMessage(id, {
                text: text,
                contextInfo: {
                  mentionedJid: [user],
                  externalAdReply: {
                    title: "𝚁𝙴𝙼-𝙱𝙾𝚃",
                    body: "𝙱𝙸𝙴𝙽𝚅𝙴𝙽𝙸𝙳𝙾",
                    thumbnailUrl: "https://i.pinimg.com/564x/92/05/f0/9205f0b8b38e296f91cd09690a0ab3b2.jpg",
                    sourceUrl:
                      "https://github.com/davidprospero123/REM-CHAM-MD",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                  },
                },
              });
            } catch (error) {
              console.error(
                `Error al generar la imagen de bienvenida: ${error}`,
              );
            }
          }
        }
      }
      break;

    case "remove":
      if (chat.welcome) {
        let groupMetadata =
          (await this.groupMetadata(id)) || (conn.chats[id] || {}).metadata;
        for (let user of participants) {
          let pp, ppgp;
          try {
            pp = await this.profilePictureUrl(user, "image");
            ppgp = await this.profilePictureUrl(id, "image");
          } catch (error) {
            console.error(`Error retrieving profile picture: ${error}`);
            pp = "https://i.pinimg.com/564x/92/05/f0/9205f0b8b38e296f91cd09690a0ab3b2.jpg"; // Assign default image URL
            ppgp = "https://i.pinimg.com/564x/92/05/f0/9205f0b8b38e296f91cd09690a0ab3b2.jpg"; // Assign default image URL
          } finally {
            let text = (
              chat.sBye ||
              this.bye ||
              conn.bye ||
              "Hola, @user"
            ).replace("@user", "@" + user.split("@")[0]);

            let nthMember = groupMetadata.participants.length;
            let secondText = `
╭───[ 𝙰𝙳𝙸𝙾𝚂 ]───
│ 𝙰𝚍𝚒𝚘𝚜, ${nthMember}𝚍𝚎 𝚎𝚜𝚝𝚎 𝚐𝚛𝚞𝚙𝚘
│
│ 𝚓𝚊𝚖𝚊𝚜 𝚚𝚞𝚎𝚛𝚒𝚖𝚘𝚜 𝚟𝚎𝚛𝚝𝚎
╰────────═┅═────────`;

            let leaveApiUrl = `https://i.pinimg.com/564x/92/05/f0/9205f0b8b38e296f91cd09690a0ab3b2.jpg${encodeURIComponent(
              await this.getName(user),
            )}&guildName=${encodeURIComponent(await this.getName(id))}&guildIcon=${encodeURIComponent(
              ppgp,
            )}&memberCount=${encodeURIComponent(
              nthMember.toString(),
            )}&avatar=${encodeURIComponent(pp)}&background=${encodeURIComponent(
              "https://i.pinimg.com/564x/92/05/f0/9205f0b8b38e296f91cd09690a0ab3b2.jpg",
            )}`;

            try {
              let leaveResponse = await fetch(leaveApiUrl);
              let leaveBuffer = await leaveResponse.buffer();

              this.sendMessage(id, {
                text: text,
                contextInfo: {
                  mentionedJid: [user],
                  externalAdReply: {
                    title: "𝚁𝙴𝙼-𝙱𝙾𝚃",
                    body: "𝙰𝙳𝙸𝙾𝚂 𝙳𝙴 𝙴𝚂𝚃𝙴 𝙶𝚁𝚄𝙿𝙸𝚃𝙾",
                    thumbnailUrl: "https://i.pinimg.com/564x/75/d1/e5/75d1e55eaca123a2815cf465d5c0d219.jpg",
                    sourceUrl:
                      "https://github.com/davidprospero123/REM-CHAM-MD",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                  },
                },
              });
            } catch (error) {
              console.error(
                `Error al generar la imagen de despedida: ${error}`,
              );
            }
          }
        }
      }
      break;
    case "promote":
      const promoteText = (
        chat.sPromote ||
        this.spromote ||
        conn.spromote ||
        `${emoji.promote} @user *AHORA ES ADMIN*`
      ).replace("@user", "@" + participants[0].split("@")[0]);

      if (chat.detect) {
        this.sendMessage(id, {
          text: promoteText.trim(),
          mentions: [participants[0]],
        });
      }
      break;
    case "demote":
      const demoteText = (
        chat.sDemote ||
        this.sdemote ||
        conn.sdemote ||
        `${emoji.demote} @user *YA NO ES ADMIN*`
      ).replace("@user", "@" + participants[0].split("@")[0]);

      if (chat.detect) {
        this.sendMessage(id, {
          text: demoteText.trim(),
          mentions: [participants[0]],
        });
      }
      break;
  }
}

/**
 * Handle groups update
 * @param {import("@whiskeysockets/baileys").BaileysEventMap<unknown>["groups.update"]} groupsUpdate
 */
export async function groupsUpdate(groupsUpdate) {
  if (opts["self"]) return;
  for (const groupUpdate of groupsUpdate) {
    const id = groupUpdate.id;
    if (!id) continue;
    let chats = global.db.data.chats[id] || {};
    const emoji = {
      desc: "📝",
      subject: "📌",
      icon: "🖼️",
      revoke: "🔗",
      announceOn: "🔒",
      announceOff: "🔓",
      restrictOn: "🚫",
      restrictOff: "✅",
    };

    let text = "";
    if (!chats.detect) continue;

    if (groupUpdate.desc) {
      text = (
        chats.sDesc ||
        this.sDesc ||
        conn.sDesc ||
        `*${emoji.desc} DESCRIPCION CAMBIADA POR*\n@desc`
      ).replace("@desc", groupUpdate.desc);
    } else if (groupUpdate.subject) {
      text = (
        chats.sSubject ||
        this.sSubject ||
        conn.sSubject ||
        `*${emoji.subject} EL TEMA FUE CAMBIADO A*\n@subject`
      ).replace("@subject", groupUpdate.subject);
    } else if (groupUpdate.icon) {
      text = (
        chats.sIcon ||
        this.sIcon ||
        conn.sIcon ||
        `*${emoji.icon} EL ICONO FUE CAMBIADO*`
      ).replace("@icon", groupUpdate.icon);
    } else if (groupUpdate.revoke) {
      text = (
        chats.sRevoke ||
        this.sRevoke ||
        conn.sRevoke ||
        `*${emoji.revoke} EL LINK DEL GRUPO FUE ACTUALIZADO*\n@revoke`
      ).replace("@revoke", groupUpdate.revoke);
    } else if (groupUpdate.announce === true) {
      text =
        chats.sAnnounceOn ||
        this.sAnnounceOn ||
        conn.sAnnounceOn ||
        `*${emoji.announceOn} GRUPO CERRADO!*`;
    } else if (groupUpdate.announce === false) {
      text =
        chats.sAnnounceOff ||
        this.sAnnounceOff ||
        conn.sAnnounceOff ||
        `*${emoji.announceOff} GRUPO ABIERTO!*`;
    } else if (groupUpdate.restrict === true) {
      text =
        chats.sRestrictOn ||
        this.sRestrictOn ||
        conn.sRestrictOn ||
        `*${emoji.restrictOn} GRUPO RESTRINGIDO ALOS MIEMBROS!*`;
    } else if (groupUpdate.restrict === false) {
      text =
        chats.sRestrictOff ||
        this.sRestrictOff ||
        conn.sRestrictOff ||
        `*${emoji.restrictOff} GRUPO SOLO PARA ADMINS!*`;
    }

    if (!text) continue;
    await this.sendMessage(id, { text, mentions: this.parseMention(text) });
  }
}

/**
Delete Chat
 */
export async function deleteUpdate(message) {
  try {
    if (
      typeof process.env.antidelete === "undefined" ||
      process.env.antidelete.toLowerCase() === "false"
    )
      return;

    const { fromMe, id, participant } = message;
    if (fromMe) return;
    let msg = this.serializeM(this.loadMessage(id));
    if (!msg) return;
    let chat = global.db.data.chats[msg.chat] || {};

    await this.reply(
      conn.user.id,
      `
            ≡ BORRASTE UN MENSAJE 
            ┌─⊷  𝘼𝙉𝙏𝙄 𝘿𝙀𝙇𝙀𝙏𝙀 
            ▢ *NOMBRE :* @${participant.split`@`[0]} 
            └─────────────
            `.trim(),
      msg,
      {
        mentions: [participant],
      },
    );
    this.copyNForward(conn.user.id, msg, false).catch((e) =>
      console.log(e, msg),
    );
  } catch (e) {
    console.error(e);
  }
}

/*
 Polling Update 
*/
export async function pollUpdate(message) {
  for (const { key, update } of message) {
    if (message.pollUpdates) {
      const pollCreation = await this.serializeM(this.loadMessage(key.id));
      if (pollCreation) {
        const pollMessage = await getAggregateVotesInPollMessage({
          message: pollCreation.message,
          pollUpdates: pollCreation.pollUpdates,
        });
        message.pollUpdates[0].vote = pollMessage;

        await console.log(pollMessage);
        this.appenTextMessage(
          message,
          message.pollUpdates[0].vote ||
            pollMessage.filter((v) => v.voters.length !== 0)[0]?.name,
          message.message,
        );
      }
    }
  }
}

/*
Update presence
*/
export async function presenceUpdate(presenceUpdate) {
  const id = presenceUpdate.id;
  const nouser = Object.keys(presenceUpdate.presences);
  const status = presenceUpdate.presences[nouser]?.lastKnownPresence;
  const user = global.db.data.users[nouser[0]];

  if (user?.afk && status === "composing" && user.afk > -1) {
    if (user.banned) {
      user.afk = -1;
      user.afkReason = "USUARIO BANEADO DE AFK";
      return;
    }

    await console.log("AFK");
    const username = nouser[0].split("@")[0];
    const timeAfk = new Date() - user.afk;
    const caption = `\n@${username} AHORA ESTAR AFK.\n\nRAZON: ${
      user.afkReason ? user.afkReason : "SIN RAZON"
    }\nPOR EL PASADO ${timeAfk.toTimeString()}.\n`;

    this.reply(id, caption, null, {
      mentions: this.parseMention(caption),
    });
    user.afk = -1;
    user.afkReason = "";
  }
}

/**
dfail
 */
global.dfail = (type, m, conn) => {
  const userTag = `👋 𝙷𝙾𝙻𝙰 *@${m.sender.split("@")[0]}*, `;
  const emoji = {
    general: "⚙️",
    owner: "👑",
    moderator: "🛡️",
    premium: "💎",
    group: "👥",
    private: "📱",
    admin: "👤",
    botAdmin: "🤖",
    unreg: "🔒",
    nsfw: "🔞",
    rpg: "🎮",
    restrict: "⛔",
  };

  const msg = {
    owner: `*${emoji.owner} 𝙲𝙾𝙽𝚂𝚄𝙻𝚃𝙰 𝙳𝙴𝙻 𝙿𝚁𝙾𝙿𝙸𝙴𝚃𝙰𝚁𝙸𝙾*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚂𝙾𝙻𝙾 𝙿𝚄𝙴𝙳𝙴 𝚂𝙴𝚁 𝚄𝚂𝙰𝙳𝙾 𝙿𝙾𝚁 𝙴𝙻 𝙼𝙾𝙳𝙴𝚁𝙰𝙳𝙾𝚁 𝙳𝙴𝙻 𝙱𝙾𝚃 𝙾 𝙼𝙸 𝙲𝚁𝙴𝙰𝙳𝙾𝚁!`,
    moderator: `*${emoji.moderator} 𝚂𝙾𝙻𝙾 𝙿𝙰𝚁𝙰 𝙼𝙾𝙳𝙴𝚁𝙰𝙳𝙾𝚁𝙴𝚂*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙴𝚂𝚃𝙰 𝙷𝙰𝙱𝙸𝙻𝙸𝚃𝙰𝙳𝙾 𝚂𝙾𝙻𝙾 𝙿𝙰𝚁𝙰 𝙻𝙾𝚂 𝙼𝙾𝙳𝙴𝚁𝙰𝙳𝙾𝚁𝙴𝚂 𝙳𝙴𝙻 𝙱𝙾𝚃!`,
    premium: `*${emoji.premium} 𝙿𝚁𝙴𝙼𝙸𝚄𝙼*\n
    ${userTag} 𝙳𝙴𝙱𝙴𝚂 𝚂𝙴𝚁 𝙿𝚁𝙴𝙼𝙸𝚄𝙼 𝙿𝙰𝚁𝙰 𝚄𝚂𝙰𝚁 𝙴𝚂𝚃𝙴 𝙲𝙾𝙼𝙰𝙽𝙳𝙾!`,
    group: `*${emoji.group} 𝚂𝙾𝙻𝙾 𝙿𝙰𝚁𝙰 𝙶𝚁𝚄𝙿𝙾𝚂*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚂𝙾𝙻𝙾 𝙿𝚄𝙴𝙳𝙴 𝚂𝙴𝚁 𝚄𝚃𝙸𝙻𝙸𝚉𝙰𝙳𝙾 𝙴𝙽 𝙲𝙷𝙰𝚃𝚂 𝙳𝙴 𝙶𝚁𝚄𝙿𝙾𝚂!`,
    private: `*${emoji.private} 𝙿𝚁𝙸𝚅𝙰𝙳𝙾*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝚂𝙾𝙻𝙾 𝙳𝙴𝙱𝙴 𝚂𝙴𝚁 𝚄𝚃𝙸𝙻𝙸𝚉𝙰𝙳𝙾 𝙴𝙽 𝙿𝚁𝙸𝚅𝙰𝙳𝙾!`,
    admin: `*${emoji.admin} 𝙰𝙳𝙼𝙸𝙽𝙸𝚂𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂*\n
    ${userTag} 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙳𝙴𝙱𝙴 𝚂𝙴𝚁 𝚄𝚂𝙰𝙳𝙾 𝙿𝙾𝚁 𝙰𝙳𝙼𝙸𝙽𝙸𝚃𝚁𝙰𝙳𝙾𝚁𝙴𝚂!`,
    botAdmin: `*${emoji.botAdmin} 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽*\n
    ${userTag} 𝚂𝙾𝙻𝙾 𝙴𝙻 𝙰𝙳𝙼𝙸𝙽𝙸𝚃𝚁𝙰𝙳𝙾𝚁 𝙳𝙴𝙻 𝙱𝙾𝚃 𝙿𝚄𝙴𝙳𝙴𝙽 𝚄𝚂𝙰𝚁 𝙳𝙸𝙲𝙷𝙾 𝙿𝙻𝚄𝙶𝙸𝙽!`,
    unreg: `*${emoji.unreg} 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙾 𝙽𝙴𝙲𝙴𝚂𝙰𝚁𝙸𝙾*\n
    ${userTag} 𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝚃𝙴 𝙳𝙴 𝙴𝚂𝚃𝙰 𝙼𝙰𝙽𝙴𝚁𝙰 :𝟹:\n\n*#register name.age*\n\n𝙴𝙹𝙴𝙼𝙿𝙻𝙾: *#register ${m.name}.18*!`,
    nsfw: `*${emoji.nsfw} 𝙽𝚂𝙵𝚆*\n
    ${userTag} 𝙽𝚂𝙵𝚆 𝙽𝙾 𝙴𝚂𝚃𝙰 𝙿𝙴𝚁𝙼𝙸𝚃𝙸𝙳𝙾 𝙴𝙽 𝙴𝙻 𝙶𝚁𝚄𝙿𝙾 𝚂𝙸 𝙴𝚁𝙴𝚂 𝙰𝙳𝙼𝙸𝙽 𝙰𝙲𝚃𝙸𝚅𝙰𝙻𝙾!`,
    restrict: `*${emoji.restrict} 𝙲𝚘𝚗𝚜𝚞𝚕𝚝𝚊 𝚍𝚎 𝚏𝚞𝚗𝚌𝚒ó𝚗 𝚒𝚗𝚊𝚌𝚝𝚒𝚟𝚊*\n
    ${userTag} 𝙴𝚜𝚝𝚊 𝚌𝚊𝚛𝚊𝚌𝚝𝚎𝚛í𝚜𝚝𝚒𝚌𝚊 𝚎𝚜𝚝á 𝚍𝚎𝚜𝚑𝚊𝚋𝚒𝚕𝚒𝚝𝚊𝚍𝚊!`,
  }[type];
  if (msg) return conn.reply(m.chat, msg, m, rcanal).then(_ => m.react(error))
};

let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update handler.js"));
  if (global.reloadHandler) console.log(await global.reloadHandler());
});