import { createNode, setAttributes, appendChildren } from '../../core/svg';
import Lineable from '../../util/lineable';

import Group from '../../base/group';

const defaultConfig = {
  circle: {
    r: 4,
    cx: 0,
    cy: 0,
  },
};

class Slot extends Group {
  /**
   * 槽
   * @param  {[type]} cx              中心x
   * @param  {[type]} cy              中心y
   * @param  {[type]} text            编号||文本
   * @param  {String} [type='output'] 类型，默认为output，其他可选如：input
   * @param  {[type]} parentBox       slot所在的node
   * @param  {[type]} [moreOpt={}]    其他的配置，如class
   * @return {[type]}                 [description]
   */
  constructor(config = {}, type = 'output', parentBox, moreOpt = {}) {
    let {
      className = '',
    } = moreOpt;
    super('g', `slot ${ className }`);

    this.config = {
      ...defaultConfig.circle,
      ..._.pick(config, [
        'cx', 'cy', 'r',
        'text',
      ]),
    };

    this.type = type;
    this.parentBox = parentBox;

    this.circle = this.initCircle(this.config.cx, this.config.cy);
    this.text = this.initText(this.config.text);

    this.update();

    this.drag = new Lineable(this, type);
  }

  getId() {
    if (!this.id) {
      return 'slot-' + super.getId();
    }
    return this.id;
  }

  initCircle(cx = 1, cy = 1) {
    let {
      circle,
    } = defaultConfig;

    let circleNode = createNode('circle', {
      ...circle,
      class: 'slot-circle',
      cx, cy,
    });

    return circleNode;
  }

  initText(text) {
    let textNode = createNode('text');
    return textNode;
  }

  update() {

    appendChildren(this.box, [
      this.circle, this.text,
    ])

  }

  destory() {
    console.log('destory:', this);
    this.drag.destory();
  }

  updateCXY({ cx, cy }) {
    this.config.cx = cx;
    this.config.cy = cy;

    setAttributes(this.circle, {
      cx, cy,
    });
  }

}

export default Slot;
