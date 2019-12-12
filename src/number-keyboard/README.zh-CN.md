# NumberKeyboard 数字键盘

### 介绍

数字键盘，提供两种样式风格，可以与[密码输入框](#/zh-CN/password-input)或自定义的输入框组件配合使用

### 引入

``` javascript
import Vue from 'vue';
import { NumberKeyboard } from 'vant';

Vue.use(NumberKeyboard);
```

## 代码演示

### 默认样式

```html
<van-button @touchstart.stop="show = true">
  弹出默认键盘
</van-button>

<van-number-keyboard
  :show="show"
  extra-key="."
  close-button-text="完成"
  @blur="show = false"
  @input="onInput"
  @delete="onDelete"
/>
```

```javascript
export default {
  data() {
    return {
      show: true
    }
  },

  methods: {
    onInput(value) {
      Toast(value);
    },
    onDelete() {
      Toast('删除');
    }
  }
}
```

### 自定义样式

```html
<van-number-keyboard
  :show="show"
  theme="custom"
  extra-key="."
  close-button-text="完成"
  @blur="show = false"
  @input="onInput"
  @delete="onDelete"
/>
```

### 双向绑定

可以通过`v-model`绑定键盘当前输入值

```html
<van-field
  readonly
  clickable
  :value="value"
  @touchstart.native.stop="show = true"
/>

<van-number-keyboard
  v-model="value"
  :show="show"
  :maxlength="6"
  @blur="show = false"
/>
```

```javascript
export default {
  data() {
    return {
      show: false,
      value: ''
    }
  }
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|------|------|
| v-model | 当前输入值 | *string* | - | 2.0.2 |
| show | 是否显示键盘 | *boolean* | - | - |
| theme | 样式风格，可选值为 `default` `custom` | *string* | `default` | - |
| title | 键盘标题 | *string* | - | - |
| maxlength | 输入值最大长度 | *string \| number* | - | 2.0.2 |
| transition | 是否开启过场动画 | *boolean* | `true` | - |
| z-index | 键盘 z-index | *number* | `100` | - |
| extra-key | 左下角按键内容 | *string* | `''` | - |
| close-button-text | 关闭按钮文字，空则不展示 | *string* | `-` | - |
| delete-button-text | 删除按钮文字 | *string* | `删除` | - |
| show-delete-key | 是否展示删除按钮 | *boolean* | `true` | - |
| hide-on-click-outside | 点击外部时是否收起键盘 | *boolean* | `true` | - |
| safe-area-inset-bottom | 是否开启底部安全区适配，[详细说明](#/zh-CN/quickstart#di-bu-an-quan-qu-gua-pei) | *boolean* | `true` | - |

### Events

| 事件名 | 说明 | 回调参数 |
|------|------|------|
| input | 点击按键时触发 | key: 按键内容 |
| delete | 点击删除键时触发 | - |
| close | 点击关闭按钮时触发 | - |
| blur | 点击关闭按钮或非键盘区域时触发 | - |
| show | 键盘完全弹出时触发 | - |
| hide | 键盘完全收起时触发 | - |

### Slots

| 名称 | 说明 |
|------|------|
| delete | 自定义删除按键内容 |
| extra-key | 自定义左下角按键内容
| title-left | 自定义标题栏左侧内容 |

## 常见问题

### 在桌面端无法操作组件？

参见[在桌面端使用](#/zh-CN/quickstart#zai-zhuo-mian-duan-shi-yong)。
