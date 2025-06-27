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

const nav = $('nav')
const main = $('main')
const link = $('#link')
const line = $('#line')
const site = $('#site')
const audio = $('audio')
const music = $('#music')
const darkMode = $('#darkMode')
const dom = document.documentElement
const sections = document.querySelectorAll('section')

// 主题模式
let theme = JSON.parse(localStorage.getItem('dark')) || false

// 是否播放音乐
let isPlay = false

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
nav.addEventListener('click', ({ target }) => {
	// 事件委托,判断点击的元素是否为A标签
	if (target.tagName === 'SPAN') {
		// 如果已是active，避免无效操作
		if (target.classList.contains('active')) return
		// 先移除active类名,再给当前点击的元素添加active类名
		$('.active').classList.remove('active')
		target.classList.add('active')
		// 滚动到当前点击元素id值对应元素的offsetLeft处
		const num = $(`[title='${target.id}']`).offsetLeft
		main.scrollLeft = num
	}
})

// 滑动页面切换Tab
main.addEventListener('scroll', e => {
	// 获取所有的section元素并遍历
	sections.forEach(item => {
		// 判断当前元素的offsetLeft值与滚动条的scrollLeft差值的绝对值是否小于元素一半宽度
		if (
			Math.abs(e.target.scrollLeft - item.offsetLeft) <
			item.getBoundingClientRect().width / 2
		) {
			// 如果已是active，避免无效操作
			if ($(`#${item.title}`).classList.contains('active')) return
			// 先移除active类名，再给当前元素对应的标签添加active类名
			$('.active').classList.remove('active')
			$(`#${item.title}`).classList.add('active')
			return
		}
	})
})

// 音乐功能
music.addEventListener('click', () => {
	// 设置音乐是否播放
	isPlay ? audio.pause() : audio.play()
	// 设置播放图标
	music.src = `assets/images/icon/${isPlay ? 'play' : 'pause'}.svg`
	isPlay = !isPlay
})

// 心知天气插件
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
