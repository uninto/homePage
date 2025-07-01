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
const icon = $('#icon')
const line = $('#line')
const site = $('#site')
const link = $('footer')
const audio = $('audio')
const music = $('#music')
const darkMode = $('#darkMode')
const dom = document.documentElement
const sections = document.querySelectorAll('section')

// 页面信息
const pageInfo = {
	title: $('title'),
	nickName: $('#info h2'),
	motto: $('#info h4'),
	avatar: $('#avatar'),
	aboutMe: $('#aboutMe'),
	image: $('#image')
}

// 主题模式
let theme = JSON.parse(localStorage.getItem('dark')) || false

// 是否播放音乐
let isPlay = false

// 判断是否为深色模式
if (theme) {
	dom.toggleAttribute('dark')
	darkMode.src = `assets/images/moon.svg`
}

// 切换主题模式
darkMode.addEventListener('click', () => {
	theme = !theme
	dom.toggleAttribute('dark')
	darkMode.src = `assets/images/${theme ? 'moon' : 'sun'}.svg`
	localStorage.setItem('dark', theme)
})

// 获取数据
fetch('/data.json')
	.then(res => res.json())
	.then(data => {
		const { userInfo, iconList, lineList, siteList, linkList } = data

		// 填充页面信息
		for (const key in userInfo) {
			if (key === 'image') pageInfo[key].src = userInfo[key]
			if (key === 'avatar') pageInfo[key].src = userInfo[key]
			if (pageInfo[key]) pageInfo[key].innerHTML = userInfo[key]
		}

		// 统一插入节点
		const renderList = (container, items, renderItem) => {
			container.innerHTML = items.map(renderItem).join('')
		}

		// 添加社交图标
		renderList(
			icon,
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
			<li>
				<a href="${item.url}" target="_blank">
					<div>
						<span style="font-size:18px">${item.name}</span><br>
						<span style="color:${item.status ? '#2ecc71' : 'tomato'}">
							${item.status ? '200' : '404'}
						</span>
					</div>
					<span style="color:#aaa">${item.content}</span>
				</a>
			</li>
    `
		)

		// 添加底部链接
		renderList(
			link,
			linkList,
			item => `
      <a href="${item.url}" target="_blank">
				${item.text}
      </a>
    `
		)
	})

// 点击页面切换
nav.addEventListener('click', ({ target }) => {
	// 判断点击的元素是否为SPAN标签
	if (target.tagName === 'SPAN') {
		// 如果已是active，避免无效操作
		if (target.classList.contains('active')) return
		// 先移除active类名,再给当前点击的元素添加active类名
		$('.active').classList.remove('active')
		target.classList.add('active')
		// 滚动到当前点击元素id值对应元素的offsetLeft处
		main.scrollLeft = $(`[title='${target.id}']`).offsetLeft
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
	music.src = `assets/images/${isPlay ? 'play' : 'pause'}.svg`
	isPlay = !isPlay
})
