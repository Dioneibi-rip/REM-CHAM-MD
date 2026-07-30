process.env.NODE_TLS_REJECT_UNAUTHORIZED="1"
import pino from "pino"
import readline from "readline"
import {useOptimizedAuthState} from "./lib/sqliteAuthState.js"
import {makeWASocket,makeCacheableSignalKeyStore,DisconnectReason} from "@whiskeysockets/baileys"

global.opts||={}
global.authFile="session"

const {state,saveCreds}=await useOptimizedAuthState(`./${global.authFile}`,{dbName:"auth.db",cleanOldFiles:true,sessionId:"main",keyFlushDelayMs:0,keyMaxFlushDelayMs:0})
const logger=pino({level:"silent"})
const methodQR=process.argv.includes("qr")
const methodCode=!methodQR
const rl=readline.createInterface({input:process.stdin,output:process.stdout})
const question=text=>new Promise(resolve=>rl.question(text,answer=>resolve(answer.trim())))
const normalizeNumber=value=>String(value||"").replace(/\D/g,"")
const getPhoneNumber=async()=>{
let number=normalizeNumber(global.botNumber||process.env.BOT_NUMBER||process.env.NUMBER||process.env.PHONE_NUMBER)
while(methodCode&&!state.creds?.registered&&!number){
number=normalizeNumber(await question("Número de WhatsApp con código de país: "))
}
return number
}
const connectionOptions={
logger,
printQRInTerminal:methodQR,
browser:["Ubuntu","Chrome","120.0.0.0"],
auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,logger)},
markOnlineOnConnect:false,
generateHighQualityLinkPreview:false,
defaultQueryTimeoutMs:60000,
connectTimeoutMs:20000,
keepAliveIntervalMs:30000,
retryRequestDelayMs:250,
fireInitQueries:true,
emitOwnEvents:true,
syncFullHistory:false,
waWebSocketUrl:"wss://web.whatsapp.com/ws/chat",
version:[2,3000,1043857760]
}
const socketResult=await makeWASocket(connectionOptions)
const conn=socketResult?.ev?socketResult:socketResult?.sock||socketResult?.socket||socketResult?.conn
if(!conn?.ev?.on)throw new TypeError("Ruby-Baileys no devolvió un socket con ev.on")
global.conn=conn
conn.ev.on("creds.update",saveCreds)
conn.ev.on("connection.update",async update=>{
const {connection,lastDisconnect}=update
if(connection==="open")console.log("Conexión abierta")
if(connection==="close"){
const code=lastDisconnect?.error?.output?.statusCode||lastDisconnect?.error?.output?.payload?.statusCode
console.error(`Conexión cerrada: ${code||"desconocido"}`)
if(code===DisconnectReason.loggedOut)process.exit(1)
}
})
if(methodCode&&!state.creds?.registered){
const phoneNumber=await getPhoneNumber()
const code=await conn.requestPairingCode(phoneNumber)
console.log(`Código: ${(code?.match(/.{1,4}/g)?.join("-")||code)}`)
rl.close()
}
