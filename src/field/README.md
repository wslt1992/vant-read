# Field

### Install

``` javascript
import Vue from 'vue';
import { Field } from 'vant';

Vue.use(Field);
```

## Usage

### Basic Usage

The value of field is bound with v-model.

```html
<van-cell-group>
  <van-field v-model="value" placeholder="Username" />
</van-cell-group>
```

### Custom Type

Use `type` prop to custom different type fields.

```html
<van-cell-group>
  <van-field
    v-model="username"
    required
    clearable
    label="Username"
    right-icon="question-o"
    placeholder="Username"
    @click-right-icon="$toast('question')"
  />

  <van-field
    v-model="password"
    type="password"
    label="Password"
    placeholder="Password"
    required
  />
</van-cell-group>
```

### Disabled

```html
<van-cell-group>
  <van-field
    value="Disabled"
    label="Username"
    left-icon="contact"
    disabled
  />
</van-cell-group>
```

### Error Info

Use `error` or `error-message` to show error info

```html
<van-cell-group>
  <van-field
    v-model="username"
    label="Username"
    placeholder="Username"
    error
  />
  <van-field
    v-model="phone"
    label="Phone"
    placeholder="Phone"
    error-message="Invalid phone"
  />
</van-cell-group>
```

### Insert Button

Use button slot to insert button

```html
<van-cell-group>
  <van-field
    v-model="sms"
    center
    clearable
    label="SMS"
    placeholder="SMS"
  >
    <van-button slot="button" size="small" type="primary">Send SMS</van-button>
  </van-field>
</van-cell-group>
```

### Auto Resize

Textarea Field can be auto resize when has `autosize` prop

```html
<van-cell-group>
  <van-field
    v-model="message"
    label="Message"
    type="textarea"
    placeholder="Message"
    rows="1"
    autosize
  />
</van-cell-group>
```

### Show Word Limit

```html
<van-cell-group>
  <van-field
    v-model="message"
    rows="2"
    autosize
    label="留言"
    type="textarea"
    maxlength="50"
    placeholder="请输入留言"
    show-word-limit
  />
</van-cell-group>
```

## API

### Props

| Attribute | Description | Type | Default | Version |
|------|------|------|------|------|
| value | Field value | *string \| number* | - | - |
| label | Field label | *string* | - | - |
| type | Input type, can be set to `tel` `number`<br>`textarea` `password` | *string* | `text` | - |
| size | Size，can be set to `large` | *string* | - | - |
| maxlength | Max length of value | *string \| number* | - | - |
| placeholder | Placeholder | *string* | - | - |
| border | Whether to show inner border | *boolean* | `true` | - |
| disabled | Whether to disable field | *boolean* | `false` | - |
| readonly | Whether to be readonly | *boolean* | `false` | - |
| required | Whether to show required mark | *boolean* | `false` | - |
| clearable | Whether to be clearable | *boolean* | `false` | - |
| clickable | Whether to show click feedback when clicked | *boolean* | `false` | - |
| is-link | Whether to show link icon | *boolean* | `false` | - |
| autofocus | Whether to auto focus, unsupported in iOS | *boolean* | `false` | - |
| show-word-limit | Whether to show word limit, need to set the `maxlength` prop | *boolean* | `false` | 2.2.8 |
| error | Whether to show error info | *boolean* | `false` | - |
| arrow-direction | Can be set to `left` `up` `down` | *string* | - | 2.0.4 |
| error-message | Error message | *string* | `''` | - |
| label-class | Label className | *any* | - | - |
| label-width | Label width | *string \| number* | `90px` | - |
| label-align | Label text align, can be set to `center` `right` | *string* | `left` | - |
| input-align | Input text align, can be set to `center` `right` | *string* | `left` | - |
| error-message-align | Error message text align, can be set to `center` `right` | *string* | `left` | - |
| autosize | Textarea auto resize，can accpet an object,<br>e.g. { maxHeight: 100, minHeight: 50 } | *boolean \| object* | `false` | - |
| left-icon | Left side icon name | *string* | - | - |
| right-icon | Right side icon name | *string* | - | - |

### Events

Field support all native events of input tag

| Event | Description | Parameters |
|------|------|------|
| input | Triggered when input value changed | value: current value |
| focus | Triggered when input gets focus | event: Event |
| blur | Triggered when input loses focus | event: Event |
| clear | Triggered when click clear icon | event: Event |
| click | Triggered when click Field | event: Event |
| click-left-icon | Triggered when click the left icon of Field | event: Event |
| click-right-icon | Triggered when click the right icon of Field | event: Event |

### Methods

Use [ref](https://vuejs.org/v2/api/#ref) to get Field instance and call instance methods

| Name | Description | Attribute | Return value |
|------|------|------|------|
| focus | Trigger input focus | - | - |
| blur | Trigger input blur | - | - |

### Slots

| Name | Description |
|------|------|
| label | Custom label |
| input | Custom input |
| left-icon | Custom left icon |
| right-icon | Custom right icon |
| button | Insert button |
