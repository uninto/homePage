/*
 * Author: Mason
 * Email: uninto@icloud.com
 * Website: https://uninto.com/
 * GItHub: https://github.com/uninto/homePage
 * 请勿删除，感谢
 */

// 简化获取元素
const $ = dom => {
	return document.querySelector(dom)
}

const nav = $('nav')
const main = $('main')
const socialLinks = $('#social-links')
const historyList = $('#history-list')
const sites = $('#site-list')
const filingLinks = $('#filing-links')
const audio = $('#music-audio')
const music = $('#music-toggle')
const darkMode = $('#darkMode')
const dom = document.documentElement

// 页面信息
const pageInfo = {
	nickName: $('#info h1'),
	motto: $('#info p'),
	avatar: $('#avatar'),
	aboutMe: $('#aboutMe'),
	image: $('#image')
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')
const ease = 'cubic-bezier(0.16, 1, 0.3, 1)'

// 按钮图标换图时旋转淡入；减少动态效果时只淡入
const spinIcon = btn =>
	btn.firstElementChild.animate(
		reduceMotion.matches
			? { opacity: [0, 1] }
			: { opacity: [0, 1], transform: ['rotate(-90deg) scale(0.6)', 'none'] },
		{ duration: 300, easing: ease }
	)

// 主题模式：有手动选择（'true'/'false'）用选择，否则跟随系统
const setTheme = dark => {
	dom.toggleAttribute('dark', dark)
	darkMode.firstElementChild.src = `assets/images/${dark ? 'moon' : 'sun'}.svg`
	darkMode.setAttribute('aria-pressed', dark)
}
const systemDark = matchMedia('(prefers-color-scheme: dark)')
setTheme((localStorage.getItem('dark') ?? String(systemDark.matches)) === 'true')

// 没有手动选择时跟随系统偏好变化
systemDark.addEventListener('change', e => {
	if (localStorage.getItem('dark') === null) setTheme(e.matches)
})

// 切换主题模式并记住选择；支持 View Transitions 时新主题从按钮处圆形扩散铺满整页，不逐个元素过渡
darkMode.addEventListener('click', () => {
	const dark = !dom.hasAttribute('dark')
	if (document.startViewTransition && !reduceMotion.matches) {
		const { left, top, width, height } = darkMode.getBoundingClientRect()
		const x = left + width / 2
		const y = top + height / 2
		const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
		const t = document.startViewTransition(() => {
			setTheme(dark)
			spinIcon(darkMode)
		})
		t.ready
			.then(() =>
				dom.animate(
					{ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
					{ duration: 500, easing: ease, pseudoElement: '::view-transition-new(root)' }
				)
			)
			// 连点时上一次过渡被跳过属正常，主题已在回调里切好；其他错误照常抛出
			.catch(err => {
				if (err.name !== 'AbortError') throw err
			})
	} else {
		setTheme(dark)
		spinIcon(darkMode)
	}
	localStorage.setItem('dark', dark)
})

// 头图、头像加载完再淡入，不在入场动画之后突然冒出来；头像失败时换成占位图，同样会触发 load
// defer 脚本执行前图片可能已加载完、load 已错过，先补查一次
for (const img of [pageInfo.image, pageInfo.avatar]) {
	img.addEventListener('load', () => img.classList.add('loaded'))
	if (img.complete && img.naturalWidth) img.classList.add('loaded')
}

// 获取数据
// 相对路径：部署在子路径（如 /homePage/）下也能取到
fetch('data.json')
	.then(res => {
		if (!res.ok) throw new Error(`data.json ${res.status} ${res.statusText}`)
		return res.json()
	})
	.then(data => {
		const { userInfo, iconList, lineList, siteList, linkList } = data

		document.title = userInfo.title

		// 填充页面信息
		for (const key in userInfo) {
			if (key === 'image' || key === 'avatar') pageInfo[key].src = userInfo[key]
			else if (pageInfo[key]) pageInfo[key].innerHTML = userInfo[key]
		}

		// 统一插入节点
		const renderList = (container, items, renderItem) => {
			container.innerHTML = items.map(renderItem).join('')
		}

		// 添加社交链接，可读名称按图标文件名查表，不在表里时回退到链接地址
		const socialNames = {
			mail: '邮箱',
			github: 'GitHub',
			linuxdo: 'LINUX DO',
			tiktok: '抖音',
			serve: '数据'
		}
		const socialName = ({ icon, url }) =>
			socialNames[icon.split('/').pop().replace('.svg', '')] || url
		renderList(
			socialLinks,
			iconList,
			item => `
      <li>
        <a href="${item.url}" target="_blank" aria-label="${socialName(item)}">
          <img src="${item.icon}" alt="">
        </a>
      </li>
    `
		)

		// 添加历程
		renderList(
			historyList,
			lineList,
			item => `
      <li>
        <div class="focus"></div>
        <div>${item.time}</div>
        <div>${item.text}</div>
      </li>
    `
		)

		// 添加站点
		renderList(
			sites,
			siteList,
			item => `
			<li>
				<a href="${item.url}" target="_blank" rel="noopener noreferrer">
					<span class="site-info">
						<span class="site-name">${item.name}</span>
						<span class="site-domain">${item.content}</span>
					</span>
					<span class="site-status">
						检测中
					</span>
				</a>
			</li>
    `
		)

		// 检测站点状态：跨域站点须返回允许主页来源的 CORS 头，否则显示"检测失败"
		sites.querySelectorAll('a').forEach(item => {
			const status = item.querySelector('.site-status')
			const controller = new AbortController()
			const timeout = setTimeout(() => controller.abort(), 5000)
			fetch(item.href, {
				method: 'HEAD',
				cache: 'no-store',
				credentials: 'omit',
				signal: controller.signal
			})
				.then(res => {
					status.textContent = String(res.status)
					status.style.setProperty(
						'--site-status-color',
						`var(${res.ok ? '--accent-color' : '--danger-color'})`
					)
				})
				.catch(error => {
					status.textContent = controller.signal.aborted
						? '检测超时'
						: '检测失败'
					status.title = error.message
					status.style.setProperty('--site-status-color', 'var(--danger-color)')
				})
				.finally(() => {
					clearTimeout(timeout)
					// 结果出来时淡入，不硬切文字
					if (!reduceMotion.matches) status.animate({ opacity: [0, 1] }, 180)
				})
		})

		// 添加备案链接
		renderList(
			filingLinks,
			linkList,
			item => `
      <a href="${item.url}" target="_blank">
				${item.text}
      </a>
    `
		)
	})
	.catch(err => {
		console.error(err)
		pageInfo.nickName.textContent = '内容加载失败'
		pageInfo.motto.textContent = '请稍后刷新重试'
	})

// 头像加载失败时换成昵称首字占位（底色由样式表按主题提供）
pageInfo.avatar.addEventListener(
	'error',
	() => {
		const initial =
			[...pageInfo.nickName.textContent.trim()][0]?.replace(/[<&]/, '') || '?'
		pageInfo.avatar.src = `data:image/svg+xml,${encodeURIComponent(
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><text x="45" y="45" dy=".35em" text-anchor="middle" font-size="40" fill="#fff" font-family="sans-serif">${initial}</text></svg>`
		)}`
	},
	{ once: true }
)

// 高亮导航项并标注为当前分页
const setActive = navItem => {
	const active = nav.querySelector('.active')
	active.classList.remove('active')
	active.removeAttribute('aria-current')
	navItem.classList.add('active')
	navItem.setAttribute('aria-current', 'page')
	movePill()
}

// 指示块对齐当前导航项；字体加载完和窗口尺寸变化后按钮宽度会变，重新对齐
const pill = $('.nav-pill')
const movePill = () => {
	// 用 offset* 而非 getBoundingClientRect：按下时按钮在 scale(.98) 回弹中，后者会量到缩放后的尺寸；offset* 取整误差 < 0.5px
	const a = nav.querySelector('.active')
	pill.style.width = `${a.offsetWidth}px`
	pill.style.height = `${a.offsetHeight}px`
	pill.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop}px)`
}
movePill()
requestAnimationFrame(() => pill.classList.add('ready'))
document.fonts.ready.then(movePill)
addEventListener('resize', movePill)

// 点击导航切换分页
nav.addEventListener('click', ({ target }) => {
	// 判断点击的元素是否为分页按钮
	if (target.dataset.page) {
		// 如果已是active，避免无效操作
		if (target.classList.contains('active')) return
		setActive(target)
		// 平滑滚动途经中间分页时不改高亮，否则指示块会先到目标、再退回中间页、最后回来
		lockNavScroll()
		// 滚动到对应分页的offsetLeft处
		main.scrollLeft = $(`#${target.dataset.page}`).offsetLeft
	}
})

// 导航上左右方向键切换到相邻分页（首尾循环）
nav.addEventListener('keydown', e => {
	const step = { ArrowLeft: -1, ArrowRight: 1 }[e.key]
	if (!step || !e.target.dataset.page) return
	e.preventDefault()
	const navItems = [...nav.querySelectorAll('[data-page]')]
	const next =
		navItems[
			(navItems.indexOf(e.target) + step + navItems.length) % navItems.length
		]
	next.focus()
	next.click()
})

// 按滚动位置高亮当前分页：每页正好占满 main 宽度，四舍五入就是页码（导航按钮与分页同序）
const syncActive = () => {
	const navItem =
		nav.querySelectorAll('[data-page]')[
			Math.round(main.scrollLeft / main.clientWidth)
		]
	if (navItem && !navItem.classList.contains('active')) setActive(navItem)
}

// 点击导航后锁住滚动高亮，滚动停下 150ms（或根本没滚动）后解锁并按最终位置同步一次；不用 scrollend，Safari 还不支持
let navScrolling = false
let navScrollTimer
const lockNavScroll = () => {
	navScrolling = true
	clearTimeout(navScrollTimer)
	navScrollTimer = setTimeout(() => {
		navScrolling = false
		syncActive()
	}, 150)
}

// 滑动切换分页高亮
main.addEventListener('scroll', () => {
	if (navScrolling) lockNavScroll()
	else syncActive()
})

// 页内提示：非阻塞、自动消失，重复调用复用同一个提示并重新计时
const toast = $('#toast')
let toastTimer
const showToast = text => {
	toast.textContent = text
	toast.hidden = false
	clearTimeout(toastTimer)
	toastTimer = setTimeout(() => (toast.hidden = true), 3000)
}

// 音乐功能：图标和读屏状态以音频的播放/暂停事件为准
const syncMusic = () => {
	const src = `assets/images/${audio.paused ? 'play' : 'pause'}.svg`
	if (music.firstElementChild.getAttribute('src') === src) return
	music.firstElementChild.src = src
	spinIcon(music)
	music.setAttribute('aria-pressed', !audio.paused)
}
audio.addEventListener('playing', syncMusic)
audio.addEventListener('pause', syncMusic)
const musicFail = err => {
	console.error(err)
	audio.pause()
	showToast('音乐暂时无法播放，请稍后再试')
}
// 音源加载失败时 error 只在 <source> 上触发且不冒泡、play() 也不会拒绝，所以在捕获阶段一并监听
audio.addEventListener('error', e => musicFail(audio.error || e), true)
music.addEventListener('click', () => {
	if (!audio.paused) return audio.pause()
	// 音源失败后 play() 不会重试加载，需重新 load
	if (audio.networkState === audio.NETWORK_NO_SOURCE) audio.load()
	// 播放前被暂停或重新加载会以 AbortError 拒绝，不算失败
	audio.play().catch(err => err.name !== 'AbortError' && musicFail(err))
})

// 头像彩蛋：点击抖一下（纯装饰，不进 Tab 顺序）
// 左右抖动一次，幅度逐次衰减；用独立的 translate 属性，不和按下时的 transform 冲突。连点会从头再抖
pageInfo.avatar.addEventListener('click', () => {
	if (reduceMotion.matches) return
	pageInfo.avatar.animate(
		{ translate: ['0', '-6px', '5px', '-3px', '2px', '0'] },
		{ duration: 360, easing: 'ease-out' }
	)
})

// 入场动画只在页面处于前台时播一次；后台打开的页面等切回前台再播，没播就是终态
const playEnter = () => {
	if (document.visibilityState !== 'visible') return
	document.removeEventListener('visibilitychange', playEnter)
	for (const el of [nav, main, filingLinks]) el.classList.add('enter')
}
playEnter()
document.addEventListener('visibilitychange', playEnter)
