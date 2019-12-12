# Overlay

### Install

``` javascript
import Vue from 'vue';
import { Overlay } from 'vant';

Vue.use(Overlay);
```

## Usage

### Basic Usage

```html
<van-button type="primary" text="Show Overlay" @click="show = true" />

<van-overlay :show="show" @click="show = false" />
```

```js
export default {
  data() {
    return {
      show: false
    }
  }
},
```

### Embedded Content

```html
<van-overlay :show="show" @click="show = false">
  <div class="wrapper" @click.stop>
    <div class="block" />
  </div>
</van-overlay>

<style>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
```

## API

### Props

| Attribute | Description | Type | Default | Version |
|------|------|------|------|------|
| show | Whether to show overlay | *boolean* | `false` | - |
| z-index | z-index | *string \| number* | `1` | - |
| duration | Animation duration | *string \| number* | `0.3` | - |
| class-name | ClassName | *string* | - | - |
| custom-class | Custom style | *object* | - | 2.2.5 |

### Events

| Event | Description | Arguments | Version |
|------|------|------|------|
| click | Triggered when clicked | event: Event | - |

### Slots

| Name | Description | Version |
|------|------|------|
| default | Default slot | 2.2.5 |
