/*
 * Author: 景昇
 * Email: uninto@icloud.com
 * Website: https://uninto.com/
 * GItHub: https://github.com/uninto/homePage
 * 请勿删除此信息
 */

//时间轴数据
const line = [
  {
    time: '2023-11-25',
    text: '敬请期待'
  },
  {
    time: '2023-08-25',
    text: 'ICP备案成功'
  },
  {
    time: '2023-08-17',
    text: '网安备案成功'
  },
  {
    time: '2022-10-22',
    text: '注册新域名'
  },
  {
    time: '2022-10-22',
    text: '注销所有备案'
  },
  {
    time: '2022-10-22',
    text: '域名出售'
  },
  {
    time: '2021-02-08',
    text: '独自完成第一个主页'
  },
  {
    time: '...',
    text: '...'
  },
  {
    time: '2018-01-06',
    text: '搭建第一个网站'
  }
]

// 站点数据
const site = [
  {
    name: '百度',
    content: '百度一下,你就知道',
    url: 'https://www.baidu.com/',
    status: true
  },
  {
    name: '谷歌',
    content: '谷歌搜索',
    url: 'https://www.google.com/',
    status: false
  },
  {
    name: '必应',
    content: '必应搜索',
    url: 'https://cn.bing.com/',
    status: true
  },
  {
    name: '搜狗',
    content: '搜狗搜索',
    url: 'https://sogou.com/',
    status: true
  },
  {
    name: '360',
    content: '360搜索',
    url: 'https://www.so.com/',
    status: true
  }
]

for (let i in line) {
  // 创建li元素
  const li = document.createElement('li')
  // 设置li元素的内容
  li.innerHTML = `
      <div class="focus"></div>
      <div>${line[i].time}</div>
      <div>${line[i].text}</div>
    `
  // 将li元素添加到ul元素中
  document.querySelector('#line').appendChild(li)
}

for (let i in site) {
  // 创建li元素
  const li = document.createElement('li')
  // 设置li元素的内容
  li.innerHTML = `
    <a href="${site[i].url}" target="_blank" style="color:black">
      <span class="status">${
        site[i].status
          ? '<span style="color:#2ecc71">200</span>'
          : '<span style="color:tomato">404</span>'
      }</span>
      <span style="font-size:18px">${site[i].name}</span><br>
      <span style="color:#424242">${site[i].content}</span>
    </a>
    `
  // 将li元素添加到ul元素中
  document.querySelector('#site').appendChild(li)
}

// 页面切换
document.querySelector('nav').addEventListener('click', e => {
  // 事件委托,判断点击的元素是否为A标签
  if (e.target.tagName === 'A') {
    // 先移除active类名,再给当前点击的元素添加active类名
    document.querySelector('.active').classList.remove('active')
    e.target.classList.add('active')
  }
})

let timer = null
// 监听滚动事件,并设置防抖
document.querySelector('main').addEventListener('scroll', e => {
  // 先清除定时器
  if (timer) clearTimeout(timer)
  // 设置定时器
  timer = setTimeout(() => {
    // 获取所有的section元素并遍历
    document.querySelectorAll('section').forEach(item => {
      // 判断滚动条的位置是否等于当前元素的offsetLeft值
      if (e.target.scrollLeft === item.offsetLeft) {
        // 先移除active类名,再给当前元素对应的A标签添加active类名
        document.querySelector('.active').classList.remove('active')
        document.querySelector(`[href='#${item.id}']`).classList.add('active')
        return
      }
    })
  }, 200) // 延迟200毫秒执行
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
