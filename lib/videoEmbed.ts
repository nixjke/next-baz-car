/**
 * Приводит ссылку к URL для <iframe src>. Дублирует логику бэкенда для старых записей в БД.
 */
const YT_ID = /^[a-zA-Z0-9_-]{11}$/
const YT_WATCH =
  /(?:youtube\.com\/watch\?[^#]*v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/
const YT_SHORTS = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/i

export function normalizeVideoEmbedUrl(url: string | null | undefined): string | undefined {
  if (url == null) return undefined
  let s = String(url).trim()
  if (!s) return undefined
  if (s.startsWith('//')) s = 'https:' + s
  const low = s.toLowerCase()
  if (low.includes('youtube.com/embed/') || low.includes('player.vimeo.com')) return s
  const mWatch = YT_WATCH.exec(s)
  if (mWatch && YT_ID.test(mWatch[1])) return `https://www.youtube.com/embed/${mWatch[1]}`
  const mShorts = YT_SHORTS.exec(s)
  if (mShorts) {
    const vid = mShorts[1].slice(0, 11)
    if (vid.length === 11 && YT_ID.test(vid)) return `https://www.youtube.com/embed/${vid}`
  }
  return s
}
