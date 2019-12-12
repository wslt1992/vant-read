# Swipe 轮播

### 引入

``` javascript
import Vue from 'vue';
import { Swipe, SwipeItem } from 'vant';

Vue.use(Swipe).use(SwipeItem);
```

## 代码演示

### 基础用法

通过`autoplay`属性设置自动轮播间隔

```html
<van-swipe :autoplay="3000" indicator-color="white">
  <van-swipe-item>1</van-swipe-item>
  <van-swipe-item>2</van-swipe-item>
  <van-swipe-item>3</van-swipe-item>
  <van-swipe-item>4</van-swipe-item>
</van-swipe>
```

### 图片懒加载

配合 [Lazyload](#/zh-CN/lazyload) 组件实现图片懒加载

```html
<van-swipe :autoplay="3000">
  <van-swipe-item v-for="(image, index) in images" :key="index">
    <img v-lazy="image" />
  </van-swipe-item>
</van-swipe>
```

```javascript
export default {
  data() {
    return {
      images: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg'
      ]
    }
  }
}
```

### 监听 change 事件

```html
<van-swipe @change="onChange">
  <van-swipe-item>1</van-swipe-item>
  <van-swipe-item>2</van-swipe-item>
  <van-swipe-item>3</van-swipe-item>
  <van-swipe-item>4</van-swipe-item>
</van-swipe>
```

```js
export default {
  methods: {
    onChange(index) {
      Toast('当前 Swipe 索引：' + index);
    }
  }
}
```

### 纵向滚动

设置`vertical`属性后滑块会纵向排列，此时需要指定滑块容器的高度

```html
<van-swipe style="height: 200px;" vertical>
  <van-swipe-item>1</van-swipe-item>
  <van-swipe-item>2</van-swipe-item>
  <van-swipe-item>3</van-swipe-item>
  <van-swipe-item>4</van-swipe-item>
</van-swipe>
```

### 自定义滑块大小

滑块默认宽度为`100%`，可以通过`width`属性设置单个滑块的宽度。纵向滚动模式下，可以通过`height`属性设置单个滑块的高度。

```html
<van-swipe :loop="false" :width="300">
  <van-swipe-item>1</van-swipe-item>
  <van-swipe-item>2</van-swipe-item>
  <van-swipe-item>3</van-swipe-item>
  <van-swipe-item>4</van-swipe-item>
</van-swipe>
```

> 目前不支持在循环滚动模式下自定义滑块大小，因此需要将 loop 设置为 false

### 自定义指示器

通过`indicator`插槽可以自定义指示器的样式

```html
<van-swipe @change="onChange">
  <van-swipe-item>1</van-swipe-item>
  <van-swipe-item>2</van-swipe-item>
  <van-swipe-item>3</van-swipe-item>
  <van-swipe-item>4</van-swipe-item>

  <div class="custom-indicator" slot="indicator">
    {{ current + 1 }}/4
  </div>
</van-swipe>
```

```js
export default {
  data() {
    return {
      current: 0
    }
  },
  methods: {
    onChange(index) {
      this.current = index;
    }
  }
}
```

## API

### Swipe Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|------|------|
| autoplay | 自动轮播间隔，单位为 ms | *number* | - | - |
| duration | 动画时长，单位为 ms | *number* | `500` | - |
| initial-swipe | 初始位置索引值 | *number* | `0` | - |
| width | 滑块宽度 | *number* | `auto` | - |
| height | 滑块高度 | *number* | `auto` | - |
| loop | 是否开启循环播放 | *boolean* | `true` | - |
| show-indicators | 是否显示指示器 | *boolean* | `true` | - |
| indicator-color | 指示器颜色 | *string* | `#1989fa` | - |
| vertical | 是否为纵向滚动 | *boolean* | `false` | - |
| touchable | 是否可以通过手势滑动 | *boolean* | `true` | - |
| stop-propagation | 是否阻止滑动事件冒泡 | *boolean* | `true` | 2.2.13 |

### Swipe Events

| 事件名 | 说明 | 回调参数 | 版本 |
|------|------|------|------|
| change | 每一页轮播结束后触发 | index, 当前页的索引 | - |

### SwipeItem Events

| 事件名 | 说明 | 回调参数 | 版本 |
|------|------|------|------|
| click | 点击时触发 | event: Event | - |

### Swipe 方法

通过 [ref](https://cn.vuejs.org/v2/api/#ref) 可以获取到 Swipe 实例并调用实例方法

| 方法名 | 说明 | 参数 | 返回值 | 版本 |
|------|------|------|------|------|
| swipeTo | 滚动到目标位置 | index: number, options: Options | void | - |
| resize | 外层元素大小变化后，可以调用此方法来触发重绘 | - | void | 2.2.14 |

### swipeTo Options 格式

| 名称 | 说明 | 类型 |
|------|------|------|
| immediate | 是否跳过动画 | *boolean* |

### Swipe Slots

| 名称 | 说明 | 版本 |
|------|------|------|
| default | 轮播内容 | - |
| indicator | 自定义指示器 | - |

## 常见问题

### 滑动轮播时为什么触发了 click 事件？

这种情况通常是由于项目中引入了`fastclick`库导致的。`fastclick`的原理是通过 Touch 事件模拟出 click 事件，而 Swipe 内部默认会阻止 touchmove 事件冒泡，干扰了 fastclick 的判断，导致出现这个问题。

将 Swipe 组件的 stop-propagation 属性设置为 false 即可避免该问题。
