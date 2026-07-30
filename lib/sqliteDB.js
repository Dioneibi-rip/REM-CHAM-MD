import { existsSync, readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const DEFAULT_DATA = {
  users: {},
  chats: {},
  stats: {},
  msgs: {},
  sticker: {},
  settings: {},
};

export class SQLiteJSONAdapter {
constructor(filename="database.sqlite"){
this.filename=String(filename||"database.sqlite");
this.legacyJson=this.filename.replace(/\.sqlite$/i,".json");
this.db=null;
this.pendingWrite=Promise.resolve();
this.writeStatement=null;
}

_open(){
if(this.db)return this.db;
const Database=require("better-sqlite3");
this.db=new Database(this.filename);
this.db.pragma("journal_mode = WAL");
this.db.pragma("synchronous = NORMAL");
this.db.exec(`
CREATE TABLE IF NOT EXISTS kv_store (
key TEXT PRIMARY KEY,
value TEXT NOT NULL,
updated_at INTEGER NOT NULL
)
`);
this.writeStatement=this.db.prepare(`
INSERT INTO kv_store (key,value,updated_at)
VALUES (?,?,?)
ON CONFLICT(key) DO UPDATE SET
value=excluded.value,
updated_at=excluded.updated_at
`);
return this.db;
}

read(){
const db=this._open();
const row=db.prepare("SELECT value FROM kv_store WHERE key = ?").get("global");
if(row?.value)return JSON.parse(String(row.value));
if(existsSync(this.legacyJson)){
const legacy=JSON.parse(readFileSync(this.legacyJson,"utf8")||"{}");
return {...DEFAULT_DATA,...legacy};
}
return {...DEFAULT_DATA};
}

write(data){
const safeData=data&&typeof data==="object"?data:{};
const payload=JSON.stringify({...DEFAULT_DATA,...safeData})||"{}";
this.pendingWrite=this.pendingWrite.catch(()=>{}).then(()=>new Promise((resolve,reject)=>{
setImmediate(()=>{
try{
this._open();
this.writeStatement.run("global",payload,Date.now());
resolve();
}catch(error){
reject(error);
}
});
}));
return this.pendingWrite;
}
}
