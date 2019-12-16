import { deepClone } from '../utils/deep-clone';
import { createNamespace, isObj } from '../utils';
import { range } from '../utils/format/number';
import { preventDefault } from '../utils/dom/event';
import { TouchMixin } from '../mixins/touch';

const DEFAULT_DURATION = 200;

// 惯性滑动思路:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_LIMIT_TIME` 且 move
// 距离大于 `MOMENTUM_LIMIT_DISTANCE` 时，执行惯性滑动
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;

const [createComponent, bem] = createNamespace('picker-column');

function getElementTranslateY(element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform || style.webkitTransform;
  const translateY = transform.slice(7, transform.length - 1).split(', ')[5];

  return Number(translateY);
}

function isOptionDisabled(option) {
  return isObj(option) && option.disabled;
}

export default createComponent({
  mixins: [TouchMixin],

  props: {
    valueKey: String,
    allowHtml: Boolean,
    className: String,
    itemHeight: Number,
    defaultIndex: Number,
    swipeDuration: Number,
    visibleItemCount: Number,
    initialOptions: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      offset: 0,
      duration: 0,
      options: deepClone(this.initialOptions),
      currentIndex: this.defaultIndex
    };
  },

  created() {
    if (this.$parent.children) {
      // 把自己放入父组件的children中
      this.$parent.children.push(this);
    }

    // 默认选中项
    this.setIndex(this.currentIndex);
  },

  destroyed() {
    const { children } = this.$parent;

    if (children) {
      children.splice(children.indexOf(this), 1);
    }
  },

  watch: {
    defaultIndex() {
      this.setIndex(this.defaultIndex);
    }
  },

  computed: {
    count() {
      return this.options.length;
    },

    // 基础偏移量 = 20 *（6 -1 ）/2 = 2.5个itemHeight的高度
    baseOffset() {
      return (this.itemHeight * (this.visibleItemCount - 1)) / 2;
    }
  },

  methods: {
    onTouchStart(event) {
      // 获取到开始点x和y
      this.touchStart(event);

      // 当前正在移动
      if (this.moving) {
        const translateY = getElementTranslateY(this.$refs.wrapper);
        this.offset = Math.min(0, translateY - this.baseOffset);
        this.startOffset = this.offset;
      } else {
        // 当前没有在移动
        this.startOffset = this.offset;
      }

      this.duration = 0;
      this.transitionEndTrigger = null;
      this.touchStartTime = Date.now();
      this.momentumOffset = this.startOffset;
    },

    onTouchMove(event) {
      this.moving = true;
      // 获取到偏移量和detalX和detalY
      this.touchMove(event);

      // 当前滑动的方向，是 垂直的 ，则禁用默认事件，并且停止事件传播
      if (this.direction === 'vertical') {
        preventDefault(event, true);
      }

      // 得到在范围的值 依次为 value,min,max
      this.offset = range(
        this.startOffset + this.deltaY,
        -(this.count * this.itemHeight),
        this.itemHeight
      );

      const now = Date.now();
      // 让操作分段。记录下，最后一段的 开始时间 和 开始偏移量
      if (now - this.touchStartTime > MOMENTUM_LIMIT_TIME) {
        this.touchStartTime = now;
        this.momentumOffset = this.offset;
      }
    },

    onTouchEnd() {
      // 获取到最后一段 到 目前的 偏移量 和 时间
      const distance = this.offset - this.momentumOffset;
      const duration = Date.now() - this.touchStartTime;
      // 允许推进（快速滑动）。
      // duration < MOMENTUM_LIMIT_TIME：松手时间段 小于 限制时长，用户才是 快速滑动。如果非，则是滑动后停止在松手
      // Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE：如果滑动的距离很小，也不是快速滑动
      // 两个条件都满足，则 滑动时间短，距离长。就是快速滑动。
      const allowMomentum =
        duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

      if (allowMomentum) {
        this.momentum(distance, duration);
        return;
      }

      const index = this.getIndexByOffset(this.offset);
      this.moving = false;
      this.duration = DEFAULT_DURATION;
      this.setIndex(index, true);
    },

    onTransitionEnd() {
      this.stopMomentum();
    },

    onClickItem(index) {
      if (this.moving) {
        return;
      }

      this.duration = DEFAULT_DURATION;
      this.setIndex(index, true);
    },

    adjustIndex(index) {
      index = range(index, 0, this.count);

      for (let i = index; i < this.count; i++) {
        if (!isOptionDisabled(this.options[i])) return i;
      }

      for (let i = index - 1; i >= 0; i--) {
        if (!isOptionDisabled(this.options[i])) return i;
      }
    },

    getOptionText(option) {
      return isObj(option) && this.valueKey in option ? option[this.valueKey] : option;
    },

    setIndex(index, userAction) {
      index = this.adjustIndex(index) || 0;
      this.offset = -index * this.itemHeight;

      const trigger = () => {
        if (index !== this.currentIndex) {
          this.currentIndex = index;

          if (userAction) {
            this.$emit('change', index);
          }
        }
      };

      // 若有触发过 `touchmove` 事件，那应该
      // 在 `transitionend` 后再触发 `change` 事件
      if (this.moving) {
        // 我的注释：当前函数可能被代码调用，然而，当前正在执行滑动动画。等动画结束后在执行 该函数的 选中item
        // 如果不做判断，手指在滑动过程中，会连续触发多个值 发送到父组件。
        this.transitionEndTrigger = trigger;
      } else {
        trigger();
      }
    },

    setValue(value) {
      const { options } = this;
      for (let i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i);
        }
      }
    },

    getValue() {
      return this.options[this.currentIndex];
    },

    // 通过偏移量计算到 选中的项目index
    getIndexByOffset(offset) {
      return range(Math.round(-offset / this.itemHeight), 0, this.count - 1);
    },

    momentum(distance, duration) {
      // 滑动的速度
      const speed = Math.abs(distance / duration);

      // 0.002是一个 插值，相当于变速器
      // 这里的不是distance，应该是 目标offset
      // (speed / 0.002) * (distance < 0 ? -1 : 1) 才是distance
      distance = this.offset + (speed / 0.002) * (distance < 0 ? -1 : 1);

      // 获取到选中项目的index
      const index = this.getIndexByOffset(distance);

      this.duration = this.swipeDuration;
      this.setIndex(index, true);
    },

    stopMomentum() {
      this.moving = false;
      this.duration = 0;

      if (this.transitionEndTrigger) {
        this.transitionEndTrigger();
        this.transitionEndTrigger = null;
      }
    },

    genOptions() {
      const optionStyle = {
        height: `${this.itemHeight}px`
      };

      return this.options.map((option, index) => {
        const text = this.getOptionText(option);
        const disabled = isOptionDisabled(option);

        const data = {
          style: optionStyle,
          attrs: {
            role: 'button',
            tabindex: disabled ? -1 : 0
          },
          class: [
            'van-ellipsis',
            bem('item', {
              disabled,
              selected: index === this.currentIndex
            })
          ],
          on: {
            click: () => {
              this.onClickItem(index);
            }
          }
        };

        if (this.allowHtml) {
          data.domProps = {
            innerHTML: text
          };
        }

        return <li {...data}>{this.allowHtml ? '' : text}</li>;
      });
    }
  },

  render() {
    const wrapperStyle = {
      transform: `translate3d(0, ${this.offset + this.baseOffset}px, 0)`,
      transitionDuration: `${this.duration}ms`,
      transitionProperty: this.duration ? 'all' : 'none',
      lineHeight: `${this.itemHeight}px`
    };

    return (
      <div
        class={[bem(), this.className]}
        onTouchstart={this.onTouchStart}
        onTouchmove={this.onTouchMove}
        onTouchend={this.onTouchEnd}
        onTouchcancel={this.onTouchEnd}
      >
        <ul
          ref="wrapper"
          style={wrapperStyle}
          class={bem('wrapper')}
          onTransitionend={this.onTransitionEnd}
        >
          {this.genOptions()}
        </ul>
      </div>
    );
  }
});
