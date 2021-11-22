let fetch = require('node-fetch')

let handler = async (m, { conn, args }) => {
  if (!args[0]) throw 'Uhm...url nya mana?'
  let res = await fetch(API('Velgrynd', '/api/tiktok2', { url: args[0] }))
  if (!res.ok) throw await res.text()
  let json = await res.json()
  let { nowm } = json.result
  conn.sendFile(m.chat, nowm, 'tiktok.mp4', '', m)
}
handler.help = ['tiktok'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(tik(tok)?(dl)?)$/i

handler.limit = true

module.exports = handler
