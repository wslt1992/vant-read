import Vue from 'vue';
import Grid from '..';
import GridItem from '../../grid-item';
import { mount } from '../../../test';

Vue.use(Grid);
Vue.use(GridItem);

test('click grid item', () => {
  const onClick = jest.fn();
  const wrapper = mount({
    template: `
      <van-grid>
        <van-grid-item @click="onClick" />
      </van-grid>
    `,
    methods: {
      onClick
    }
  });

  const Item = wrapper.find('.van-grid-item__content');
  Item.trigger('click');

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('sqaure and set gutter', () => {
  const wrapper = mount({
    template: `
      <van-grid square :column-num="2" gutter="10rem">
        <van-grid-item />
        <van-grid-item />
        <van-grid-item />
      </van-grid>
    `
  });

  expect(wrapper).toMatchSnapshot();
});

test('icon-size prop', () => {
  const wrapper = mount({
    template: `
      <van-grid icon-size="10">
        <van-grid-item icon="success" />
      </van-grid>
    `
  });

  expect(wrapper).toMatchSnapshot();
});

test('render icon-slot', () => {
  const wrapper = mount({
    template: `
      <van-grid icon-size="10">
        <van-grid-item info="1">
          <div slot="icon" />
        </van-grid-item>
      </van-grid>
    `
  });

  expect(wrapper).toMatchSnapshot();
});
