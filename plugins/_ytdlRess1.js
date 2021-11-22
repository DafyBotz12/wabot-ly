let limit = 30
const { servers, yta } = require('../lib/y2mate')
let handler = async (m, { conn, args, isPrems, isOwner }) => {
let chat = global.db.data.chats[m.chat]
  if (!args || !args[0]) throw 'Uhm... urlnya mana?'
  let server = (args[1] || 'id4').toLowerCase()
  let { dl_link, thumb, title, filesize, filesizeF} = await yta(args[0], servers.includes(server) ? server : 'id4')
  let isLimit = (isPrems || isOwner ? 99 : limit) * 1024 < filesize
 let fs = require('fs')
 let y = fs.readFileSync('./src/thumb.jpeg')


conn.sendMessage(m.chat, `*Title:* ${title}\n*Size:* ${filesizeF}` , 'conversation', {quoted: m, thumbnail: global.thumb, contextInfo:{externalAdReply: {title: 'Simple WhatsApp bot', body: `© ${conn.user.name}`, sourceUrl: '', thumbnail: y}}})
  if (!isLimit) conn.sendFile(m.chat, dl_link , `By ${conn.user.name}.mp3`, m, false, {ptt: true, duration: 999999999999, asDocument: chat.useDocument})
}
handler.command = /^dlmsc$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 0
handler.limit = true

module.exports = handler
