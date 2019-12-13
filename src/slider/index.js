import { createNamespace, addUnit } from '../utils';
import { TouchMixin } from '../mixins/touch';
import { preventDefault } from '../utils/dom/event';

// bem 生成class名字。以van前缀，加上输入参数'slider',例如：bem('bar') --> van--slider__bar
const [createComponent, bem] = createNamespace('slider');

export default createComponent({
  mixins: [TouchMixin],

  props: {
    disabled: Boolean,
    vertical: Boolean,
    activeColor: String,
    inactiveColor: String,
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: Number,
      default: 0
    },
    barHeight: {
      type: [Number, String],
      default: 2
    }
  },

  data() {
    return {
      dragStatus: ''
    };
  },

  computed: {
    range() {
      return this.max - this.min;
    }
  },

  created() {
    // format initial value
    this.updateValue(this.value);
  },

  methods: {
    onTouchStart(event) {
      if (this.disabled) {
        return;
      }

      this.touchStart(event);
      this.startValue = this.format(this.value);
      this.dragStatus = 'start';
    },

    onTouchMove(event) {
      if (this.disabled) {
        return;
      }

      if (this.dragStatus === 'start') {
        this.$emit('drag-start');
      }

      preventDefault(event, true);
      this.touchMove(event);
      this.dragStatus = 'draging';

      const rect = this.$el.getBoundingClientRect();
      // 是纵向的吗？如果是，就获取deltaY，如果不是，就获取deltaX
      const delta = this.vertical ? this.deltaY : this.deltaX;
      // 是纵向的吗？如果是，就获取Rect的 高 ，如果不是，就获取宽
      const total = this.vertical ? rect.height : rect.width;
      // slider显示的距离（像素差值） = 像素差值 * 范围
      const diff = (delta / total) * this.range;

      // 新值 = touch开始值 + diff
      this.newValue = this.startValue + diff;
      this.updateValue(this.newValue);
    },

    onTouchEnd() {
      if (this.disabled) {
        return;
      }

      // 只有托动过，才有新值newValue，所以设置newvalue到value
      if (this.dragStatus === 'draging') {
        this.updateValue(this.newValue, true);
        this.$emit('drag-end');
      }

      this.dragStatus = '';
    },

    onClick(event) {
      // 停止事件传播
      event.stopPropagation();

      if (this.disabled) return;

      const rect = this.$el.getBoundingClientRect();
      // clientY-rect.top = 差值 理解，事件点距离屏幕窗口ClientY；当前div最上方 距离 窗口顶部的距离。
      const delta = this.vertical ? event.clientY - rect.top : event.clientX - rect.left;
      const total = this.vertical ? rect.height : rect.width;
      const value = (delta / total) * this.range + this.min;

      this.startValue = this.value;
      this.updateValue(value, true);
    },

    updateValue(value, end) {
      value = this.format(value);

      // touch新的值 !== 上一次发送事件的值,那么发送input事件,发送新新值
      if (value !== this.value) {
        this.$emit('input', value);
      }

      // 当touch结束，才发送change值。新值 !== touch开始的值
      if (end && value !== this.startValue) {
        this.$emit('change', value);
      }
    },

    format(value) {
      return (
        Math.round(Math.max(this.min, Math.min(value, this.max)) / this.step) * this.step
      );
    }
  },

  render() {
    // 方向，默认横向
    const { vertical } = this;
    // 进度条没激活时的样子
    const style = {
      background: this.inactiveColor
    };

    // 主轴，默认 width（横向）
    const mainAxis = vertical ? 'height' : 'width';
    // 交叉轴，默认 height（纵向）
    const crossAxis = vertical ? 'width' : 'height';

    const barStyle = {
      // 当前value-最小值min得到差值A，差值A 除 总长 得到百分比 例子： 范围 20--120    公式（100-20）/100=80
      [mainAxis]: `${((this.value - this.min) * 100) / this.range}%`,
      // 交叉轴的高，默认值为2
      [crossAxis]: addUnit(this.barHeight),
      // 激活时的颜色
      background: this.activeColor
    };

    // 拖拽状态
    if (this.dragStatus) {
      barStyle.transition = 'none';
    }

    return (
      <div
        style={style}
        class={bem({ disabled: this.disabled, vertical })}
        onClick={this.onClick}
      >
        <div class={bem('bar')} style={barStyle}>
          <div
            role="slider"
            tabindex={this.disabled ? -1 : 0}
            aria-valuemin={this.min}
            aria-valuenow={this.value}
            aria-valuemax={this.max}
            aria-orientation={this.vertical ? 'vertical' : 'horizontal'}
            class={bem('button-wrapper')}
            onTouchstart={this.onTouchStart}
            onTouchmove={this.onTouchMove}
            onTouchend={this.onTouchEnd}
            onTouchcancel={this.onTouchEnd}
          >
            {this.slots('button') || <div class={bem('button')} />}
          </div>
        </div>
      </div>
    );
  }
});
