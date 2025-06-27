/*
 * Author: 景昇
 * Email: uninto@icloud.com
 * Website: https://uninto.com/
 * GItHub: https://github.com/uninto/homePage
 * 请勿删除，感谢
 */

// 简化获取元素
const $ = dom => {
	return document.querySelector(dom)
}

const link = $('#link')
const line = $('#line')
const site = $('#site')
const music = $('audio')
const darkMode = $('#darkMode')
const dom = document.documentElement

let theme = JSON.parse(localStorage.getItem('dark')) || false

// 判断是否为深色模式
if (theme) {
	dom.toggleAttribute('dark')
	darkMode.src = `assets/images/icon/moon.svg`
}

// 切换主题模式
darkMode.addEventListener('click', () => {
	theme = !theme
	dom.toggleAttribute('dark')
	darkMode.src = `assets/images/icon/${theme ? 'moon' : 'sun'}.svg`
	localStorage.setItem('dark', theme)
})

// 获取数据
fetch('/data.json')
	.then(res => res.json())
	.then(data => {
		const { iconList, lineList, siteList } = data

		// 统一插入节点
		const renderList = (container, items, renderItem) => {
			const html = items.map(renderItem).join('')
			container.insertAdjacentHTML('beforeend', html)
		}

		// 添加社交图标
		renderList(
			link,
			iconList,
			item => `
      <li>
        <a href="${item.url}" target="_blank">
          <img src="${item.icon}" alt="icon">
        </a>
      </li>
    `
		)

		// 添加时间轴
		renderList(
			line,
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
			site,
			siteList,
			item => `
      <a href="${item.url}" target="_blank">
        <li>
          <span class="status">
            <span style="color:${item.status ? '#2ecc71' : 'tomato'}">
              ${item.status ? '200' : '404'}
            </span>
          </span>
          <span style="font-size:18px">${item.name}</span><br>
          <span style="color:#aaa">${item.content}</span>
        </li>
      </a>
    `
		)
	})

// 点击页面切换
document.querySelector('nav').addEventListener('click', e => {
	// 事件委托,判断点击的元素是否为A标签
	if (e.target.tagName === 'A') {
		// 阻止默认事件
		e.preventDefault()
		// 先移除active类名,再给当前点击的元素添加active类名
		document.querySelector('.active').classList.remove('active')
		e.target.classList.add('active')
		// 获取name为当前点击元素id值的元素的offsetLeft值
		const num = document.querySelector(`[title='${e.target.id}']`).offsetLeft
		document.querySelector('main').scrollTo({ left: num, behavior: 'smooth' })
	}
})

// 滑动页面切换Tab
let timer = null
// 监听滚动事件，并设置防抖
document.querySelector('main').addEventListener('scroll', e => {
	// 先清除定时器
	if (timer) clearTimeout(timer)
	// 设置定时器
	timer = setTimeout(() => {
		// 获取所有的section元素并遍历
		document.querySelectorAll('section').forEach(item => {
			// 判断当前元素的offsetLeft值与滚动条的scrollLeft值的差的绝对值是否小于误差阈值
			if (Math.abs(e.target.scrollLeft - item.offsetLeft) < 50) {
				// 先移除active类名，再给当前元素对应的A标签添加active类名
				document.querySelector('.active').classList.remove('active')
				document.querySelector(`#${item.title}`).classList.add('active')
				return
			}
		})
	}, 200) // 延迟200毫秒执行
})

// 音乐功能
let isPlay = false
// 监听音乐按钮点击事件
document.querySelector('#music').addEventListener('click', function () {
	// 判断音乐是否在播放
	if (isPlay) {
		// 播放音乐
		music.pause()
		this.src = 'assets/images/icon/play.svg'
	} else {
		// 暂停音乐
		music.play()
		this.src = 'assets/images/icon/pause.svg'
	}
	isPlay = !isPlay
})

// 天气插件
!(function (a, h, g, f, e, d, c, b) {
	b = function () {
		d = h.createElement(g)
		c = h.getElementsByTagName(g)[0]
		d.src = e
		d.charset = 'utf-8'
		d.async = 1
		c.parentNode.insertBefore(d, c)
	}
	a['SeniverseWeatherWidgetObject'] = f
	a[f] ||
		(a[f] = function () {
			;(a[f].q = a[f].q || []).push(arguments)
		})
	a[f].l = +new Date()
	if (a.attachEvent) {
		a.attachEvent('onload', b)
	} else {
		a.addEventListener('load', b, false)
	}
})(
	window,
	document,
	'script',
	'SeniverseWeatherWidget',
	'//cdn.sencdn.com/widget2/static/js/bundle.js?t=' +
		parseInt((new Date().getTime() / 100000000).toString(), 10)
)
window.SeniverseWeatherWidget('show', {
	flavor: 'bubble',
	location: 'WX4FBXXFKE4F',
	geolocation: true,
	language: 'zh-Hans',
	unit: 'c',
	theme: 'auto',
	token: 'ac1d036a-99f3-4f88-ae98-f795bb93a9f0',
	hover: 'disabled',
	container: 'tp-weather-widget'
})
