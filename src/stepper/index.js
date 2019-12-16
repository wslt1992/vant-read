import { createNamespace, isDef, addUnit } from '../utils';
import { resetScroll } from '../utils/dom/reset-scroll';
import { preventDefault } from '../utils/dom/event';

const [createComponent, bem] = createNamespace('stepper');

const LONG_PRESS_START_TIME = 600;
const LONG_PRESS_INTERVAL = 200;

function equal(value1, value2) {
  return String(value1) === String(value2);
}

// 浮点数运算bug。避免浮点数的加和乘
// add num and avoid float number
function add(num1, num2) {
  // 这里表示10 的10 次方
  const cardinal = 10 ** 10;
  return Math.round((num1 + num2) * cardinal) / cardinal;
}

export default createComponent({
  props: {
    // v-model 绑定的值
    value: null,
    integer: Boolean,
    disabled: Boolean,
    inputWidth: [Number, String],
    buttonSize: [Number, String],
    asyncChange: Boolean,
    disablePlus: Boolean,
    disableMinus: Boolean,
    disableInput: Boolean,
    decimalLength: Number,
    name: {
      type: [Number, String],
      default: ''
    },
    min: {
      type: [Number, String],
      default: 1
    },
    max: {
      type: [Number, String],
      default: Infinity
    },
    step: {
      type: [Number, String],
      default: 1
    },
    // 默认值
    defaultValue: {
      type: [Number, String],
      default: 1
    },
    showPlus: {
      type: Boolean,
      default: true
    },
    showMinus: {
      type: Boolean,
      default: true
    }
  },

  data() {
    // 如果有赋值，就不用默认值
    const defaultValue = isDef(this.value) ? this.value : this.defaultValue;
    // 格式化值
    const value = this.format(defaultValue);

    // 格式化的值，不等于 未格式化的值，发送事件给父组件
    if (!equal(value, this.value)) {
      this.$emit('input', value);
    }

    return {
      // 当前值
      currentValue: value
    };
  },

  computed: {
    // 禁用 - ：
    // 1.外部全禁用  2.外部minus禁用 3. 当前值 小于等于 最小值
    minusDisabled() {
      return this.disabled || this.disableMinus || this.currentValue <= this.min;
    },

    // 禁用 +：
    // 1.外部全禁用  2.外部plus禁用 3. 当前值 大于等于 最大值
    plusDisabled() {
      return this.disabled || this.disablePlus || this.currentValue >= this.max;
    },

    inputStyle() {
      const style = {};

      if (this.inputWidth) {
        style.width = addUnit(this.inputWidth);
      }

      if (this.buttonSize) {
        style.height = addUnit(this.buttonSize);
      }

      return style;
    },

    buttonStyle() {
      if (this.buttonSize) {
        const size = addUnit(this.buttonSize);

        return {
          width: size,
          height: size
        };
      }
    }
  },

  watch: {
    value(val) {
      if (!equal(val, this.currentValue)) {
        this.currentValue = this.format(val);
      }
    },

    currentValue(val) {
      this.$emit('input', val);
      this.$emit('change', val, { name: this.name });
    }
  },

  methods: {
    // filter illegal characters
    filter(value) {
      // 过滤非0-9
      value = String(value).replace(/[^0-9.-]/g, '');
      // 是整数，有小数点，得到整数
      if (this.integer && value.indexOf('.') !== -1) {
        value = value.split('.')[0];
      }

      return value;
    },

    format(value) {
      // 过滤得到数字字符
      value = this.filter(value);

      // format range
      value = value === '' ? 0 : +value;
      // 得到范围里面的值
      // 大值里面取最小，小值里面得到最大的。得到限制范围里的值
      value = Math.max(Math.min(this.max, value), this.min);

      // 四舍五入
      // format decimal
      if (isDef(this.decimalLength)) {
        value = value.toFixed(this.decimalLength);
      }

      return value;
    },

    onInput(event) {
      const { value } = event.target;

      // allow input to be empty
      if (value === '') {
        return;
      }

      let formatted = this.filter(value);

      // limit max decimal length
      if (isDef(this.decimalLength) && formatted.indexOf('.') !== -1) {
        const pair = formatted.split('.');
        formatted = `${pair[0]}.${pair[1].slice(0, this.decimalLength)}`;
      }

      if (!equal(value, formatted)) {
        event.target.value = formatted;
      }

      this.emitChange(formatted);
    },
    // 同步变化，还是异步变化
    emitChange(value) {
      if (this.asyncChange) {
        // 异步变化，将得到的新值通知给父组件，然后等待父组件重新设置v-model:value。在组件内监听value的变化，设置currentValue
        this.$emit('input', value);
        this.$emit('change', value, { name: this.name });
      } else {
        // 同步变化
        this.currentValue = value;
      }
    },
    // 根据 点击的按钮type，运算新值
    onChange() {
      const { type } = this;

      // 如果该按钮被禁用，则跳过
      if (this[`${type}Disabled`]) {
        this.$emit('overlimit', type);
        return;
      }

      // 确定 值的正负
      const diff = type === 'minus' ? -this.step : +this.step;

      // 运算，格式化
      const value = this.format(add(+this.currentValue, diff));

      // 通知父组件
      this.emitChange(value);
      this.$emit(type);
    },

    onFocus(event) {
      this.$emit('focus', event);
    },

    onBlur(event) {
      const value = this.format(event.target.value);
      event.target.value = value;
      this.currentValue = value;
      this.$emit('blur', event);

      resetScroll();
    },

    // 这是连续的 定时器，LONG_PRESS_INTERVAL=200
    longPressStep() {
      this.longPressTimer = setTimeout(() => {
        this.onChange(this.type);
        this.longPressStep(this.type);
      }, LONG_PRESS_INTERVAL);
    },

    onTouchStart() {
      clearTimeout(this.longPressTimer);
      this.isLongPress = false;

      // 这是开始时 定时器，时间间隔LONG_PRESS_START_TIME=600
      this.longPressTimer = setTimeout(() => {
        this.isLongPress = true;
        this.onChange();
        this.longPressStep();
      }, LONG_PRESS_START_TIME);
    },

    onTouchEnd(event) {
      // 清理 定时器
      clearTimeout(this.longPressTimer);

      // 阻止按钮click事件响应
      if (this.isLongPress) {
        preventDefault(event);
      }
    }
  },

  render() {
    const createListeners = type => ({
      on: {
        click: () => {
          this.type = type;
          this.onChange();
        },
        touchstart: () => {
          this.type = type;
          this.onTouchStart(type);
        },
        touchend: this.onTouchEnd,
        touchcancel: this.onTouchEnd
      }
    });

    return (
      <div class={bem()}>
        <button
          vShow={this.showMinus}
          type="button"
          style={this.buttonStyle}
          class={bem('minus', { disabled: this.minusDisabled })}
          {...createListeners('minus')}
        />
        <input
          type="number"
          role="spinbutton"
          class={bem('input')}
          value={this.currentValue}
          aria-valuemax={this.max}
          aria-valuemin={this.min}
          aria-valuenow={this.currentValue}
          disabled={this.disabled || this.disableInput}
          style={this.inputStyle}
          onInput={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <button
          vShow={this.showPlus}
          type="button"
          style={this.buttonStyle}
          class={bem('plus', { disabled: this.plusDisabled })}
          {...createListeners('plus')}
        />
      </div>
    );
  }
});
