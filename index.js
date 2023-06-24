const { default: WAConnection, useMultiFileAuthState, generateWAMessageFromContent, getContentType, downloadContentFromMessage, makeCacheableSignalKeyStore } = require('@whiskeyconnets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const { format } = require('util');
const { PassThrough } = require('stream');
const { watchFile } = require('fs');
const { exec } = require('child_process');

const start = async () => {
const { state, saveCreds } = await useMultiFileAuthState('session')
      
const level = pino({ level: 'silent' })
const conn = WAConnection({
  logger: level,
  printQRInTerminal: true,
  browser: ['Yanfei', 'Firefox', '3.0.0'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, level),
  }
});

conn.ev.on('connection.update', v => {
  const { connection, lastDisconnect } = v;
  if (connection === 'close') {
    if (lastDisconnect.error.output.statusCode !== 401) {
      start();
    } else {
      exec('rm -rf session');
      console.error('Scan QR!');
      start();
    }
  } else if (connection === 'open') {
    console.log('Bot connected!');
  }
});

conn.ev.on('creds.update', saveCreds);
conn.ev.on('messages.upsert', async m => {
const time = moment().tz('Asia/Jakarta').format('HH:mm:ss')
const { ownerNumber, ownerName, botName, otakudesuUrl } = require('./setting.json');
//SERIAL
if (!m.messages) return;
const msg = m.messages[0];
const from = msg.key.remoteJid;
const type = getContentType(msg.message);
const quotedType = getContentType(msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage) || null;

if (type === 'ephemeralMessage') {
  if (msg && msg.message && msg.message.ephemeralMessage && msg.message.ephemeralMessage.message) {
    msg.message = msg.message.ephemeralMessage.message;
    if (msg.message.viewOnceMessage) {
      msg.message = msg.message.viewOnceMessage;
    }
  }
}

if (type === 'viewOnceMessage') {
  if (msg && msg.message && msg.message.viewOnceMessage) {
    msg.message = msg.message.viewOnceMessage.message;
  }
}

const body =
  type === 'imageMessage' || type === 'videoMessage'
    ? msg.message[type].caption
    : type === 'conversation'
    ? msg.message[type]
    : type === 'extendedTextMessage'
    ? msg.message[type].text
    : '';

const isGroup = from.endsWith('@g.us');
let sender = isGroup ? msg.key.participant : from;
sender = sender.includes(':') ? sender.split(':')[0] + '@s.whatsapp.net' : sender;
const senderName = msg.pushName;
const senderNumber = sender.split('@')[0];
const groupMetadata = isGroup ? await conn.groupMetadata(from) : null;
const participants = isGroup ? await groupMetadata.participants : '';
const groupName = groupMetadata?.subject || '';
const groupMembers = groupMetadata?.participants || [];
const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id);
const isGroupAdmins = groupAdmins.includes(sender);
const botId = conn.user.id.includes(':') ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : conn.user.id;
const isBotGroupAdmins = groupMetadata && groupAdmins.includes(botId);
const isOwner = ownerNumber.includes(sender);
const isCmd = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\\\©^]/.test(body);
const prefix = isCmd ? body[0] : '';
const args = body.trim().split(/ +/).slice(1);
//REPLY AN
const reply = (teks) => {
  conn.sendMessage(from, { text: teks }, { quoted: msg });
};
let command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : '';
let q = args.join(' ');

function parseMs(ms) {
  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  let days = Math.floor(ms / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds: ms % 1000
  };
}

  if (!isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ PRIVATE ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'))
  if (isGroup && !isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[  GROUP  ]', 'aqua'), color(body.slice(0, 50), 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))
  if (!isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'))
  if (isGroup && isCmd) console.log(color(`[ ${time} ]`, 'white'), color('[ COMMAND ]', 'aqua'), color(body, 'white'), 'from', color(senderNumber, 'yellow'), 'in', color(groupName, 'yellow'))
	
    switch (command) {
case 'menu': case '?':
  reply(`$\n=>\n>`);
  break;
 /* default:
  if (!isOwner) return
if (body.startsWith('>')) {
  try {
    let value = await eval(`(async () => { ${body.slice(1)} })()`);
    await reply(format(value));
  } catch (e) {
    await reply(e);
  }
}

  if (!isOwner) return
if (body.startsWith('<')) {
  try {
    let value = await eval(`(async () => { return ${body.slice(1)} })()`);
    await reply(format(value));
  } catch (e) {
    await reply(e);
  }
}*/

            default:
             if (budy.startsWith('>>')) {
             if (!isCreator) return 
                    function Return(sul) {
                    sat = JSON.stringify(sul, null, 2)
                    bang = util.format(sat)
                    if (sat == undefined) {
                    bang = util.format(sul)
                        }
                     return reply(bang)
                    }
                    try {
                        reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
                    } catch (e) {
                        reply(String(e))
                    }
                }

                if (budy.startsWith('>')) {
                    if (!isCreator) return 
                    try {
                        let evaled = await eval(budy.slice(2))
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        await reply(evaled)
                    } catch (err) {
                        await reply(String(err))
                    }
                }

                if (budy.startsWith('$')) {
                    if (!isCreator) return 
                    exec(budy.slice(2), (err, stdout) => {
                        if (err) return reply(err)
                        if (stdout) return reply(stdout)
                  })                                                                       
            }
      })
}
    start();
