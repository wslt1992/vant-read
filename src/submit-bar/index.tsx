import { createNamespace } from '../utils';
import { emit, inherit } from '../utils/functional';
import Button, { ButtonType } from '../button';
import Icon from '../icon';

// Types
import { CreateElement, RenderContext } from 'vue/types';
import { ScopedSlot, DefaultSlots } from '../utils/types';

export type SubmitBarProps = {
  tip?: string;
  tipIcon?: string;
  label?: string;
  price?: number;
  loading?: boolean;
  currency: string;
  disabled?: boolean;
  buttonType: ButtonType;
  buttonText?: string;
  suffixLabel?: string;
  decimalLength: number;
  safeAreaInsetBottom?: boolean;
  textAlign?: 'right' | 'left';
};

export type SubmitBarSlots = DefaultSlots & {
  top?: ScopedSlot;
  tip?: ScopedSlot;
};

const [createComponent, bem, t] = createNamespace('submit-bar');

function SubmitBar(
  h: CreateElement,
  props: SubmitBarProps,
  slots: SubmitBarSlots,
  ctx: RenderContext<SubmitBarProps>
) {
  const { tip, price, tipIcon } = props;

  function Text() {
    if (typeof price === 'number') {
      const priceArr = (price / 100).toFixed(props.decimalLength).split('.');
      const decimalStr = props.decimalLength ? `.${priceArr[1]}` : '';
      return (
        <div
          style={{ textAlign: props.textAlign ? props.textAlign : '' }}
          class={bem('text')}
        >
          <span>{props.label || t('label')}</span>
          <span class={bem('price')}>
            {props.currency}
            <span class={bem('price', 'integer')}>{priceArr[0]}</span>
            {decimalStr}
          </span>
          {props.suffixLabel && (
            <span class={bem('suffix-label')}>{props.suffixLabel}</span>
          )}
        </div>
      );
    }
  }

  function Tip() {
    if (slots.tip || tip) {
      return (
        <div class={bem('tip')}>
          {tipIcon && <Icon class={bem('tip-icon')} name={tipIcon} />}
          {tip && <span class={bem('tip-text')}>{tip}</span>}
          {slots.tip && slots.tip()}
        </div>
      );
    }
  }

  return (
    <div
      class={bem({ 'safe-area-inset-bottom': props.safeAreaInsetBottom })}
      {...inherit(ctx)}
    >
      {slots.top && slots.top()}
      {Tip()}
      <div class={bem('bar')}>
        {slots.default && slots.default()}
        {Text()}
        <Button
          round
          class={bem('button', props.buttonType)}
          type={props.buttonType}
          loading={props.loading}
          disabled={props.disabled}
          text={props.loading ? '' : props.buttonText}
          onClick={() => {
            emit(ctx, 'submit');
          }}
        />
      </div>
    </div>
  );
}

SubmitBar.props = {
  tip: String,
  label: String,
  price: Number,
  tipIcon: String,
  loading: Boolean,
  disabled: Boolean,
  buttonText: String,
  suffixLabel: String,
  safeAreaInsetBottom: Boolean,
  decimalLength: {
    type: Number,
    default: 2
  },
  currency: {
    type: String,
    default: '¥'
  },
  buttonType: {
    type: String,
    default: 'danger'
  },
  textAlign: String,
};

export default createComponent<SubmitBarProps, {}, SubmitBarSlots>(SubmitBar);
