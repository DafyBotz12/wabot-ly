let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let levelling = require('../lib/levelling')
const thumb = fs.readFileSync('./src/thumb.jpeg')
let tags = {
  'main': '๐ผ๐ฐ๐ธ๐ฝ',
  'game': '๐ถ๐ฐ๐ผ๐ด',
  'xp': '๐ด๐๐ฟ & ๐ป๐ธ๐ผ๐ธ๐',
  'sticker': '๐๐๐ธ๐ฒ๐บ๐ด๐',
  'kerang': '๐บ๐ด๐๐ฐ๐ฝ๐ถ ๐ฐ๐น๐ฐ๐ธ๐ฑ',
  'quotes': '๐๐๐พ๐๐ด๐',
  'admin': '๐ฐ๐ณ๐ผ๐ธ๐ฝ',
  'group': '๐ถ๐๐พ๐๐ฟ',
  'premium': '๐ฟ๐๐ด๐ผ๐ธ๐๐ผ',
  'internet': '๐ธ๐ฝ๐๐ด๐๐ฝ๐ด๐',
  'anonymous': '๐ฐ๐ฝ๐พ๐ฝ๐๐ผ๐พ๐๐ ๐ฒ๐ท๐ฐ๐',
  'nulis': '๐ผ๐ฐ๐ถ๐ด๐ ๐ฝ๐๐ป๐ธ๐ & ๐ป๐พ๐ถ๐พ',
  'downloader': '๐ณ๐พ๐๐ฝ๐ป๐พ๐ฐ๐ณ๐ด๐',
  'tools': '๐๐พ๐พ๐ป๐',
  'fun': '๐ต๐๐ฝ',
  'database': '๐ณ๐ฐ๐๐ฐ๐ฑ๐ฐ๐๐ด',
  'vote': '๐๐พ๐๐ธ๐ฝ๐ถ',
  'absen': '๐ฐ๐ฑ๐๐ด๐ฝ',
  'quran': '๐ฐ๐ป ๐๐๐ ๐ฐ๐ฝ',
  'jadibot': '๐น๐ฐ๐ณ๐ธ ๐ฑ๐พ๐',
  'owner': '๐พ๐๐ฝ๐ด๐',
  'host': '๐ท๐พ๐๐',
  'advanced': '๐ฐ๐ณ๐๐ฐ๐ฝ๐ฒ๐ด',
  'info': '๐ธ๐ฝ๐ต๐พ',
  '': '๐ฝ๐พ ๐ฒ๐ฐ๐๐ด๐ถ๐พ๐๐',
}
const defaultMenu = {
  before: `
โญโใ %me ใ
โ Hai, %name!
โ
โ Tersisa *%limit Limit*
โ Role *%role*
โ Level *%level (%exp / %maxexp)* [%xp4levelup lagi untuk levelup]
โ %totalexp XP in Total
โ 
โ Tanggal: *%week %weton, %date*
โ Tanggal Islam: *%dateIslamic*
โ Waktu: *%time*
โ
โ Uptime: *%uptime (%muptime)*
โ Database: %rtotalreg of %totalreg
โ Github :
โ https://github.com/DafyBotz12/wabot
โ Instagram :
โ https://instagram.com/raaihankhadafi8
โJoin My Grub Please Ootd Oky
โhttps://chat.whatsapp.com/DDBpEGASOb1KIcM0gRW59e
โแดแดษชษด ษขสแดส ษดแดษดแดษช แดแดแดแดแด แดสแดแดษชแดแด แดแดแดษช sษชแดแดส แดษดแดสแดแดษชแดแด
โยฉแดแดาส ษดษชส สแดษดษข
โkalo risih kick aja bot nya
โฐโโโโ
%readmore`.trimStart(),
  header: 'โโโโโโใ%categoryใโโโโโโโ',
  body: 'โโ %cmd %islimit %isPremium',
  footer: 'โโโโโโโโโโโโโโโโโโโโ\n',
  after: `
*%npmname@^%version*
${'```%npmdesc```'}
`,
}
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour12: false
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    //Iya bang sy nub
    const reply = {
    key: {
        participant: '0@s.whatsapp.net'
    },
    message: {
        orderMessage: {
            itemCount: 1122334455,
            itemCoun: 404,
            surface: 404,
            message: `ยฉ ${conn.user.name}`,
            orderTitle: 'B',
            thumbnail: thumb,
            sellerJid: '0@s.whatsapp.net'
        }
    }
}
let bb = await conn.prepareMessage('0@s.whatsapp.net', thumb, 'documentMessage', { mimetype: 'application/pdf', thumbnail: thumb })
let cc = await conn.prepareMessageFromContent(m.chat, { buttonsMessage: { contentText: `Hi! Im ${conn.user.name}\n\nHere my menu...`, footerText: text.trim(), buttons: [{ buttonId: `${_p}ping`, buttonText: { displayText: `ping` }, type: 1 }, { buttonId: `${_p}owner`, buttonText: { displayText: `owner` }, type: 1 }, { buttonId: `${_p}donasi`, buttonText: { displayText: `donasi` }, type: 1 }], headerType: 'DOCUMENT', documentMessage: { url: bb.message.documentMessage.url, mimetype: bb.message.documentMessage.mimetype, title: bb.message.documentMessage.title, fileSha256: bb.message.documentMessage.fileSha256, fileLength: '999999999', pageCount: '100', mediaKey: bb.message.documentMessage.mediaKey, fileName: conn.user.name, fileEncSha256: bb.message.documentMessage.fileEncSha256, directPath: bb.message.documentMessage.directPath, jpegThumbnail: bb.message.documentMessage.jpegThumbnail }}}, { quoted: m, contextInfo: { externalAdReply: { title: 'แดแดาสไนษดแดสษชษดแดไนแด?แดสแดษด', body: 'ษชษดษช สแดแดแดแดษด แดแดาส', mediaType: 2, thumbnail: thumb, mediaUrl: 'https://instagram.com/raaihankhadafi8' }}})
conn.relayWAMessage(cc)
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
