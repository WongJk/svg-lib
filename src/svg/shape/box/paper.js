import _ from 'lodash';
import { createNode, appendChildren } from '../../core/svg';
import Group from '../../base/group';

import ArrowBox from './arrow-box';
import { InputSlotPool } from '../../util/lineable';
import Zoomable from '../../util/zoomable';

const defaultConfig = {
  width: 800,
  height: 600,
}

class Paper extends Group {
  constructor(config) {
    super('g', 'paper');

    this.config = {
      ...defaultConfig,
      ..._.pick(config, [
        'width', 'height',
      ]),
    };

    this.grid = createNode('g', {
      class: 'grid',
    });
    this.initGrid();

    // 初始化 arrowBox，用来画arrow
    this.arrowBox = new ArrowBox();
    this.append(this.arrowBox);

    this.inputSlotPool = new InputSlotPool();

    this.update();
  }

  initGrid() {
    let {
      width, height,
    } = this.config;

    let left = -width;
    let right = width * 2;
    let top = -height;
    let bottom = height * 2;

    let pathData = [];
    for (let x = left; x <= right; x += 10) {
      pathData.push(`M${ x },${ top } L${ x },${ bottom }`);
    }

    for (let y = top; y <= bottom; y += 10) {
      pathData.push(`M${ left },${ y } L${ right },${ y }`);
    }

    let path = createNode('path', {
      d: pathData.join(' '),
      class: 'grid-line',
    });

    this.grid.appendChild(path);
    this.box.appendChild(this.grid);
  }

  appendNode(node) {
    if (_.isArray(node)) {
      return _.each(node, item => {
        this.appendNode(item);
      });
    }

    if (_.isFunction(node)) {
      node = node();
    }
    if (node instanceof Group) {
      node = node.getXMLNode();
    }

    this.box.insertBefore(node, this.arrowBox.getXMLNode());
  }

  removeNode(node) {
    console.log('remove:', node);
    this.box.removeChild(node.getXMLNode());
    node.destory();
  }
}

export default Paper;
