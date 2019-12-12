import Uploader from '..';
import { mount, later, triggerDrag } from '../../../test';

window.File = function() {
  this.size = 10000;
};

const mockFileDataUrl = 'data:image/test';
const mockFile = new File([], 'test.jpg');
const file = { target: { files: [mockFile] } };
const multiFile = { target: { files: [mockFile, mockFile] } };
const IMAGE = 'https://img.yzcdn.cn/vant/cat.jpeg';
const PDF = 'https://img.yzcdn.cn/vant/test.pdf';

window.FileReader = function() {
  this.readAsText = function() {
    this.onload &&
      this.onload({
        target: {
          result: mockFileDataUrl
        }
      });
  };
  this.readAsDataURL = this.readAsText;
};

test('disabled', () => {
  const afterRead = jest.fn();
  const wrapper = mount(Uploader, {
    propsData: {
      disabled: true,
      afterRead
    }
  });

  wrapper.vm.onChange(file);
  expect(afterRead).toHaveBeenCalledTimes(0);
});

it('result-type as text', done => {
  const wrapper = mount(Uploader, {
    propsData: {
      resultType: 'text',
      afterRead: readFile => {
        expect(readFile.content).toEqual(mockFileDataUrl);
        done();
      }
    }
  });

  wrapper.vm.onChange(file);
});

it('result-type as file', done => {
  const wrapper = mount(Uploader, {
    propsData: {
      resultType: 'file',
      afterRead: readFile => {
        expect(readFile.file).toBeTruthy();
        expect(readFile.content).toBeFalsy();
        done();
      }
    }
  });

  wrapper.vm.onChange(file);
});

it('set input name', done => {
  const wrapper = mount(Uploader, {
    propsData: {
      name: 'uploader',
      beforeRead: (readFile, detail) => {
        expect(detail.name).toEqual('uploader');
        return true;
      },
      afterRead: (readFile, detail) => {
        expect(detail.name).toEqual('uploader');
        done();
      }
    }
  });

  wrapper.vm.onChange(file);
});

it('unknown resultType', () => {
  const afterRead = jest.fn();
  const wrapper = mount(Uploader, {
    propsData: {
      resultType: 'xxxx',
      afterRead
    }
  });
  wrapper.vm.onChange(file);
  expect(afterRead).toHaveBeenCalledTimes(0);
});

it('before read return false', () => {
  const afterRead = jest.fn();
  const wrapper = mount(Uploader, {
    propsData: {
      beforeRead: () => false,
      afterRead
    }
  });

  const input = wrapper.find('input');

  wrapper.vm.onChange(file);
  expect(afterRead).toHaveBeenCalledTimes(0);
  expect(input.element.value).toEqual('');
});

it('before read return promise and resolve', async () => {
  const afterRead = jest.fn();
  const wrapper = mount(Uploader, {
    propsData: {
      beforeRead: () =>
        new Promise(resolve => {
          resolve();
        }),
      afterRead
    }
  });

  wrapper.vm.onChange(file);

  await later();
  expect(afterRead).toHaveBeenCalledTimes(1);
});

it('before read return promise and reject', async () => {
  const afterRead = jest.fn();
  const wrapper = mount(Uploader, {
    propsData: {
      beforeRead: () =>
        new Promise((resolve, reject) => {
          reject();
        }),
      afterRead
    }
  });

  const input = wrapper.find('input');

  await later();
  wrapper.vm.onChange(file);
  expect(afterRead).toHaveBeenCalledTimes(0);
  expect(input.element.value).toEqual('');
});

test('file size overlimit', async () => {
  const wrapper = mount(Uploader, {
    propsData: {
      maxSize: 1
    }
  });
  wrapper.vm.onChange(file);
  wrapper.vm.onChange(multiFile);

  await later();
  expect(wrapper.emitted('oversize')[0]).toBeTruthy();
  expect(wrapper.emitted('oversize')[1]).toBeTruthy();

  wrapper.vm.maxSize = 100000;
  wrapper.vm.onChange(multiFile);

  await later();
  expect(wrapper.emitted('oversize')[2]).toBeFalsy();
});

it('render upload-text', () => {
  const wrapper = mount(Uploader, {
    propsData: {
      uploadText: 'Text'
    }
  });

  expect(wrapper).toMatchSnapshot();
});

it('render preview image', async () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [
        { url: 'https://img.yzcdn.cn/vant/cat.jpeg' },
        { url: 'https://img.yzcdn.cn/vant/test.pdf' },
        { file: { name: 'test.pdf' } }
      ]
    },
    listeners: {
      input(fileList) {
        wrapper.setProps({ fileList });
      }
    }
  });

  wrapper.vm.onChange(file);
  await later();

  expect(wrapper).toMatchSnapshot();
});

it('image-fit prop', () => {
  const wrapper = mount(Uploader, {
    propsData: {
      imageFit: 'contain',
      fileList: [{ url: 'https://img.yzcdn.cn/vant/cat.jpeg' }]
    }
  });

  expect(wrapper).toMatchSnapshot();
});

it('disable preview image', async () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [],
      previewImage: false
    },
    listeners: {
      input(fileList) {
        wrapper.setProps({ fileList });
      }
    }
  });

  wrapper.vm.onChange(file);
  await later();

  expect(wrapper).toMatchSnapshot();
});

it('max-count prop', async () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [],
      maxCount: 1
    },
    listeners: {
      input(fileList) {
        wrapper.setProps({ fileList });
      }
    }
  });

  wrapper.vm.onChange(multiFile);
  await later();

  expect(wrapper).toMatchSnapshot();
});

it('preview-size prop', async () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [],
      previewSize: 30
    },
    listeners: {
      input(fileList) {
        wrapper.setProps({ fileList });
      }
    }
  });

  wrapper.vm.onChange(file);
  await later();

  expect(wrapper).toMatchSnapshot();
});

it('deletable prop', () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [{ url: IMAGE }]
    }
  });

  expect(wrapper.find('.van-uploader__preview-delete').element).toBeTruthy();

  wrapper.setProps({ deletable: false });
  expect(wrapper.find('.van-uploader__preview-delete').element).toBeFalsy();
});

it('delete preview image', () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [{ url: IMAGE }],
      previewSize: 30
    },
    listeners: {
      input(fileList) {
        wrapper.setProps({ fileList });
      }
    }
  });

  wrapper.find('.van-uploader__preview-delete').trigger('click');
  expect(wrapper.vm.fileList.length).toEqual(0);

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.emitted('delete')[0]).toBeTruthy();
});

it('before-delete prop return false', () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [{ url: IMAGE }],
      beforeDelete: () => false
    }
  });

  wrapper.find('.van-uploader__preview-delete').trigger('click');
  expect(wrapper.emitted('delete')).toBeFalsy();
});

it('before-delete prop return true', () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [{ url: IMAGE }],
      beforeDelete: () => true
    }
  });

  wrapper.find('.van-uploader__preview-delete').trigger('click');
  expect(wrapper.emitted('delete')).toBeTruthy();
});

it('before-delete prop resolved', async () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [{ url: IMAGE }],
      beforeDelete: () => new Promise(resolve => resolve())
    }
  });

  wrapper.find('.van-uploader__preview-delete').trigger('click');
  await later();
  expect(wrapper.emitted('delete')).toBeTruthy();
});

it('before-delete prop rejected', async () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [{ url: IMAGE }],
      beforeDelete: () => new Promise((resolve, reject) => reject())
    }
  });

  wrapper.find('.van-uploader__preview-delete').trigger('click');
  await later();
  expect(wrapper.emitted('delete')).toBeFalsy();
});

it('click to preview image', () => {
  const wrapper = mount(Uploader, {
    propsData: {
      previewFullImage: false,
      fileList: [{ url: IMAGE }, { url: PDF }]
    }
  });

  wrapper.find('.van-image').trigger('click');
  const imagePreviewNode = document.querySelector('.van-image-preview');
  expect(imagePreviewNode).toBeFalsy();

  wrapper.setProps({ previewFullImage: true });
  wrapper.find('.van-image').trigger('click');

  const imagePreviewNode2 = document.querySelector('.van-image-preview');
  expect(imagePreviewNode2.querySelectorAll('.van-image-preview__image').length).toEqual(1);
});

it('closeImagePreview method', () => {
  const close = jest.fn();
  const wrapper = mount(Uploader, {
    mocks: {
      imagePreview: {
        close
      }
    }
  });

  wrapper.vm.closeImagePreview();
  expect(close).toHaveBeenCalledTimes(1);

  // should not throw error
  const wrapper2 = mount(Uploader);
  wrapper2.vm.closeImagePreview();
});

it('click-preview event', () => {
  const wrapper = mount(Uploader, {
    propsData: {
      previewFullImage: false,
      fileList: [{ url: IMAGE }, { url: PDF }]
    }
  });

  wrapper.find('.van-image').trigger('click');
  expect(wrapper.emitted('click-preview')[0][0]).toEqual({ url: IMAGE });
  expect(wrapper.emitted('click-preview')[0][1]).toEqual({ name: '', index: 0 });
});

it('close-preview event', async () => {
  const wrapper = mount(Uploader, {
    propsData: {
      fileList: [{ url: IMAGE }]
    }
  });

  wrapper.find('.van-image').trigger('click');

  const preview = document.querySelector('.van-image-preview');
  const swipe = preview.querySelector('.van-swipe__track');
  triggerDrag(swipe, 0, 0);

  await later(300);
  expect(wrapper.emitted('close-preview')).toBeTruthy();
});
