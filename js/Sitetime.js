//运行时间
function siteTime() {
  setInterval(() => {
    const now = new Date()
    const startTime = new Date(2021, 1, 6, 0, 0, 0)
    const diff = now - startTime

    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000)

    document.getElementById(
      'sitetime'
    ).innerHTML = `已运行 ${diffDays} 天 ${diffHours} 小时 ${diffMinutes} 分钟 ${diffSeconds} 秒`
  }, 1000)
}

siteTime()
