import _ from 'lodash';
import {
  createNode,
  appendChildren,
  setAttributes,
} from '../core/svg';
import Dragable, { updateUpperSlot, updateBelowSlot } from '../util/dragable';

import Group from '../base/group';
import {InputSlot, OutputSlot} from './slot';

const defaultConfig = {
  width: 200, height: 50,
  x: 0, y: 0,
  inputs: {
    default_number: 1,
    slots: [{data_type: 1}]
  },
  outputs: {
    default_number: 2,
    slots: [{data_type: 1}, {data_type: 2}]
  }
};

class Node extends Group {
  constructor(config = {}, type, paper) {
    super('g', 'node');

    this.config = {
      ...defaultConfig,
      ..._.pick(config, [
        'width', 'height',
        'x', 'y',
        'text',
        'inputs', 'outputs',
        'event',
      ]),
    };

    // 节点的属性，数据节点 || 算法节点 || ...
    this.type = type;

    // 该node所在的 纸上
    this.paper = paper;

    // 节点的方框
    this.body = this.initBody();

    // 点上的slot槽
    // upper 和 below 两种
    this.slots = {
      upper: [],
      below: [],
    };
    this.slotsBox = {
      upper: createNode('g'),
      below: createNode('g'),
    };

    // 节点内的左右侧图片
    this.bigImage = createNode('image', {
      class: 'big-image',
      x: 4,
      y: 4 + 5,
      width: 40,
      height: 40,
    });
    this.smallImage = createNode('image');

    // 节点内的文本
    this.text = createNode('text');

    // 更新 box 的所有子节点
    this.update();

    this.drag = new Dragable(this);
  }

  getId() {
    if (!this.id) {
      return 'node-' + super.getId();
    }
    return this.id;
  }

  /**
   * 初始化 body的 rect节点
   */
  initBody() {
    let {
      width, height,
    } = this.config;

    let body = createNode('rect', {
      x: 0, y: 4,
      rx: 2, ry: 2,
      width, height,
      class: 'node-body',
    });

    return body;
  }

  /**
   * 初始化节点slot的位置
   * 分别放在 slotsBox.upper 和 slotsBox.below 的 g标签 中
   */
  initSlot() {
    let {
      inputs, outputs,
    } = this.config;
    let upperN = inputs.default_number;
    let belowN = outputs.default_number;

    let y = 4;
    for (let i = 0; i < upperN; i++) {
      let x = this.config.width * 1.0 / (upperN + 1) * (i + 1);
      let slot = new InputSlot({
        cx: x, cy: y,
        text: i + 1,
      }, this);

      this.slots.upper.push(slot);
      this.slotsBox.upper.appendChild(slot.getXMLNode());
    }

    y += this.config.height;
    for (let i = 0; i < belowN; i++) {
      let x = this.config.width * 1.0 / (belowN + 1) * (i + 1);
      let slot = new OutputSlot({
        cx: x, cy: y,
        text: i + 1,
      }, this);

      this.slots.below.push(slot);
      this.slotsBox.below.appendChild(slot.getXMLNode());
    }
  }

  addUpperSlot(slotConfig) {
    let { upper } = this.slots;
    let upperN = upper.length + 1;

    let slot = new InputSlot({
      text: upperN,
    }, this);
    upper.push(slot);
    this.slotsBox.upper.appendChild(slot.getXMLNode());

    _.each(upper, (slot, i) => {
      let x = this.config.width * 1.0 / (upperN + 1) * (i + 1);
      slot.updateCXY({
        cx: x, cy: 4
      });
    });
    updateUpperSlot(this);
  }

  addBelowSlot(slotConfig) {
    let { below } = this.slots;
    let belowN = below.length + 1;

    let slot = new OutputSlot({
      text: belowN,
    }, this);
    below.push(slot);
    this.slotsBox.below.appendChild(slot.getXMLNode());

    _.each(below, (slot, i) => {
      let x = this.config.width * 1.0 / (belowN + 1) * (i + 1);
      slot.updateCXY({
        cx: x, cy: 4 + this.config.height,
      });
    });
    updateBelowSlot(this);
  }

  initImage() {

  }

  initText() {
    this.text.textContent = this.config.text;
    setAttributes(this.text, {
      x: 40,
      y: 4,
      dx: 10,
      dy: 31,
    })
  }

  initEvent() {
    let {
      event,
    } = this.config;

    _.each(event, (eventCallback, eventType) => {
      // 一类事件只 绑定一次，触发是执行多个回调
      // TODO: 这个逻辑可能需要修改
      this.box.addEventListener(eventType, e => {
        if (_.isArray(eventCallback)) {
          _.each(eventCallback, callback => {
            callback(e, this);
          });
          return;
        }

        eventCallback(e, this);
      }, false);
    });
  }

  /**
   * 更新 this.box 里的所有子节点
   */
  update() {
    this.initSlot();
    this.initImage();
    this.initText();

    // TODO: removeChildren
    appendChildren(this.box, [
      this.body,
      this.slotsBox.upper, this.slotsBox.below,
      this.bigImage, this.smallImage,
      this.text,
    ]);

    this.initEvent();
  }

  destory() {
    console.log('destory', this);

    let {
      upper, below
    } = this.slots;

    // 处理下面的slot
    _.each(below, slot => {
      slot.destory();
    });
    // 处理上面的slot
    _.each(upper, slot => {
      slot.destory();
    });
  }
}

export default Node;
