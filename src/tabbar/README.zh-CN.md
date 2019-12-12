# Tabbar 标签栏

### 引入

``` javascript
import Vue from 'vue';
import { Tabbar, TabbarItem } from 'vant';

Vue.use(Tabbar).use(TabbarItem);
```

## 代码演示

### 基础用法

`v-model`默认绑定选中标签的索引值，通过修改`v-model`即可切换选中的标签

```html
<van-tabbar v-model="active">
  <van-tabbar-item icon="home-o">标签</van-tabbar-item>
  <van-tabbar-item icon="search">标签</van-tabbar-item>
  <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
  <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
</van-tabbar>
```

```javascript
export default {
  data() {
    return {
      active: 0
    }
  }
}
```

### 通过名称匹配

在标签指定`name`属性的情况下，`v-model`的值为当前标签的`name`

```html
<van-tabbar v-model="active">
  <van-tabbar-item name="home" icon="home-o">标签</van-tabbar-item>
  <van-tabbar-item name="search" icon="search">标签</van-tabbar-item>
  <van-tabbar-item name="friends" icon="friends-o">标签</van-tabbar-item>
  <van-tabbar-item name="setting" icon="setting-o">标签</van-tabbar-item>
</van-tabbar>
```

```javascript
export default {
  data() {
    return {
      active: 'home'
    }
  }
}
```

### 提示信息

设置`dot`属性后，会在图标右上角展示一个小红点。设置`info`属性后，会在图标右上角展示相应的徽标

```html
<van-tabbar v-model="active">
  <van-tabbar-item icon="home-o">标签</van-tabbar-item>
  <van-tabbar-item icon="search" dot>标签</van-tabbar-item>
  <van-tabbar-item icon="friends-o" info="5">标签</van-tabbar-item>
  <van-tabbar-item icon="setting-o" info="20">标签</van-tabbar-item>
</van-tabbar>
```

### 自定义图标

通过 icon 插槽自定义图标，可以通过 `slot-scope` 判断标签是否选中

```html
<van-tabbar v-model="active">
  <van-tabbar-item info="3">
    <span>自定义</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? icon.active : icon.inactive"
    >
  </van-tabbar-item>
  <van-tabbar-item icon="search">标签</van-tabbar-item>
  <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
</van-tabbar>
```

```javascript
export default {
  data() {
    return {
      active: 0,
      icon: {
        active: 'https://img.yzcdn.cn/vant/user-active.png',
        inactive: 'https://img.yzcdn.cn/vant/user-inactive.png'
      }
    }
  }
}
```

### 自定义颜色

```html
<van-tabbar
  v-model="active"
  active-color="#07c160"
  inactive-color="#000"
>
  <van-tabbar-item icon="home-o">标签</van-tabbar-item>
  <van-tabbar-item icon="search">标签</van-tabbar-item>
  <van-tabbar-item icon="freinds-o">标签</van-tabbar-item>
  <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
</van-tabbar>
```

### 监听切换事件

```html
<van-tabbar v-model="active" @change="onChange">
  <van-tabbar-item icon="home-o">标签1</van-tabbar-item>
  <van-tabbar-item icon="search">标签2</van-tabbar-item>
  <van-tabbar-item icon="freinds-o">标签3</van-tabbar-item>
  <van-tabbar-item icon="setting-o">标签4</van-tabbar-item>
</van-tabbar>
```

```js
export default {
  methods: {
    onChange(index) {
      Notify({ type: 'primary', message: index });
    }
  }
}
```

### 路由模式

标签栏支持路由模式，用于搭配`vue-router`使用。路由模式下会匹配页面路径和标签的`to`属性，并自动选中对应的标签

```html
<router-view />

<van-tabbar route>
  <van-tabbar-item
    replace
    to="/home"
    icon="home-o"
  >
    标签
  </van-tabbar-item>
  <van-tabbar-item
    replace
    to="/search"
    icon="search"
  >
    标签
  </van-tabbar-item>
</van-tabbar>
```

## API

### Tabbar Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|------|------|
| v-model | 当前选中标签的名称或索引值 | *string \| number* | `0` | - |
| fixed | 是否固定在底部 | *boolean* | `true` | - |
| border | 是否显示外边框 | *boolean* | `true` | - |
| z-index | 元素 z-index | *number* | `1` | - |
| active-color | 选中标签的颜色 | *string* | `#1989fa` | - |
| inactive-color | 未选中标签的颜色 | *string* | `#7d7e80` | - |
| route | 是否开启路由模式 | *boolean* | `false` | - |
| safe-area-inset-bottom | 是否开启底部安全区适配，[详细说明](#/zh-CN/quickstart#di-bu-an-quan-qu-gua-pei) | *boolean* | `false` | - |

### Tabbar Events

| 事件名 | 说明 | 回调参数 |
|------|------|------|
| change | 切换标签时触发 | active: 当前选中标签的名称或索引值 |

### TabbarItem Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|------|------|
| name | 标签名称，作为匹配的标识符 | *string \| number* | 当前标签的索引值 | - |
| icon | 图标名称或图片链接，可选值见 [Icon 组件](#/zh-CN/icon)| *string* | - | - |
| dot | 是否显示图标右上角小红点 | *boolean* | `false` | - |
| info | 图标右上角徽标的内容 | *string \| number* | - | - |
| url | 点击后跳转的链接地址 | *string* | - | - |
| to | 点击后跳转的目标路由对象，同 vue-router 的 [to 属性](https://router.vuejs.org/zh/api/#to) | *string \| object* | - | - |
| replace | 是否在跳转时替换当前页面历史 | *boolean* | `false` | - |

### TabbarItem Slots

| 名称 | 说明 | SlotProps |
|------|------|------|
| icon | 自定义图标 | active: 是否为选中标签 |
