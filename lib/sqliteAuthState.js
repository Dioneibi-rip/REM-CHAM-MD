import path from "path"
import { existsSync, readFileSync, mkdirSync } from "fs"
import { createRequire } from "module"
const require = createRequire(import.meta.url)
const baileys = await import("@whiskeysockets/baileys")
const { initAuthCreds, BufferJSON, proto } = baileys.default || baileys
const KEY_MAP = {
"pre-key": "preKeys",
session: "sessions",
"sender-key": "senderKeys",
"app-state-sync-key": "appStateSyncKeys",
"app-state-sync-version": "appStateVersions",
"sender-key-memory": "senderKeyMemory"
}
const encode = (value) => JSON.stringify(value, BufferJSON.replacer)
const decode = (value) => JSON.parse(value, BufferJSON.reviver)
export function useSQLiteAuthState(authPath) {
mkdirSync(authPath, { recursive: true })
const Database = require("better-sqlite3")
const db = new Database(path.join(authPath, "auth.sqlite"))
db.pragma("journal_mode = WAL")
db.pragma("synchronous = FULL")
db.pragma("temp_store = MEMORY")
db.pragma("busy_timeout = 5000")
db.exec(`
CREATE TABLE IF NOT EXISTS auth_creds (
id TEXT PRIMARY KEY,
value TEXT NOT NULL,
updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS auth_keys (
type TEXT NOT NULL,
id TEXT NOT NULL,
value TEXT NOT NULL,
updated_at INTEGER NOT NULL,
PRIMARY KEY (type,id)
);
`)
const selectCreds = db.prepare("SELECT value FROM auth_creds WHERE id = ?")
const upsertCreds = db.prepare("INSERT INTO auth_creds (id,value,updated_at) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at")
const selectKey = db.prepare("SELECT value FROM auth_keys WHERE type = ? AND id = ?")
const upsertKey = db.prepare("INSERT INTO auth_keys (type,id,value,updated_at) VALUES (?,?,?,?) ON CONFLICT(type,id) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at")
const deleteKey = db.prepare("DELETE FROM auth_keys WHERE type = ? AND id = ?")
const saveKeysTx = db.transaction((data, now) => {
for (const baileysType in data) {
const type = KEY_MAP[baileysType] || baileysType
for (const id in data[baileysType]) {
const value = data[baileysType][id]
if (value == null) deleteKey.run(type, id)
else upsertKey.run(type, id, encode(value), now)
}
}
})
const saveCredsTx = db.transaction((value, now) => {
upsertCreds.run("creds", encode(value), now)
})
let creds = selectCreds.get("creds")?.value
creds = creds ? decode(creds) : loadLegacyCreds(authPath) || initAuthCreds()
saveCredsTx(creds, Date.now())
const keys = {
get: async (type, ids) => {
const key = KEY_MAP[type] || type
const data = {}
for (const id of ids) {
const row = selectKey.get(key, id)
if (!row?.value) continue
let value = decode(row.value)
if (type === "app-state-sync-key") value = proto.AppStateSyncKeyData.fromObject(value)
data[id] = value
}
return data
},
set: async (data) => {
saveKeysTx(data, Date.now())
},
transaction: async (work) => await work()
}
const saveCreds = () => {
saveCredsTx(creds, Date.now())
}
return { state: { creds, keys }, saveCreds, saveState: saveCreds }
}
function loadLegacyCreds(authPath) {
const file = path.join(authPath, "creds.json")
if (!existsSync(file)) return null
return decode(readFileSync(file, "utf8"))
}
export default useSQLiteAuthState
