import _ from 'lodash';

import { createNode } from './core/svg';
import Pool from './base/pool';
import Paper from './shape/box/paper';
import Node from './shape/node';

import Zoomable from './util/zoomable';
import { updateNodeTransform } from './util/dragable';
import NodeMenu from './menu/node-menu';

class SVGBoxPool extends Pool {
  constructor() {
    super();

    this.activeBox = null;
  }

  getActiveBox () {
    return this.activeBox;
  }
  setActiveBox(box) {
    this.activeBox = box;
    return this;
  }

  createBox({ width, height }, isActive) {
    let box = new SVGBox({ width, height });
    if (isActive) {
      this.setActiveBox(box);
    }
    this.add(box.getId(), box);

    return box;
  }
  deleteBox(boxId) {
    if (this.getActiveBox().getId() === boxId) {
      // TODO: pick 一个 box来让他 active
      this.setActiveBox(null);
    }
    this.softRemove(boxId);
  }
}

class SVGBox {
  constructor(config = {}) {

    let defaultConfig = {
      width: 800,
      height: 600,
    };

    this.config = {
      ...defaultConfig,
      ..._.pick(config, [
        'width', 'height',
      ]),
    };

    this.id = this.getId();

    let {
      width, height,
    } = this.config;

    this.dom = createNode('svg', {
      width, height,
    });

    // 初始化 paper
    this.paper = new Paper({width, height});
    this.dom.appendChild(this.paper.getXMLNode());

    this.zoom = new Zoomable(this);
    this.nodeMenu = new NodeMenu(this);

    // 记录当前box里所有的node引用
    this.nodeMap = {};
  }

  getId() {
    if (!this.id) {
      this.id = 'svg-box-' + Math.random().toString(16).slice(2);
    }
    return this.id;
  }

  enterDOM(parentDOM) {
    parentDOM.appendChild(this.dom);
  }

  scaleTo(k) {
    this.zoom.scaleTo(k);
  }

  // 调整box经过zoom的缩放、平移后，node应该的位置
  adjustXY(config) {
    let {
      x, y, k,
    } = this.transform;

    x = (config.x - x) * 1.0 / k;
    y = (config.y - y) * 1.0 / k;
    return {x, y};
  }

  addNode(nodeConfig) {
    let node = null;
    if (_.isArray(nodeConfig)) {
      node = _.map(nodeConfig, config => {
        _.extend(config, this.adjustXY(config));
        let node =  new Node(config, 'type', this.paper);
        this.nodeMap[node.getId()] = node;
        return node;
      });
    }
    else {
      _.extend(nodeConfig, this.adjustXY(nodeConfig));
      node = new Node(nodeConfig, 'type', this.paper);
      this.nodeMap[node.getId()] = node;
    }
    this.paper.appendNode(node);

    return node;
  }

  moveNode(node, {dx, dy}) {
    let { k } = this.transform;
    // 根据当前的缩放，来调整位移量
    dx = dx * 1.0 / k;
    dy = dy * 1.0 / k;
    updateNodeTransform(node, {dx, dy});
  }

  copyNode(node) {
    return this.addNode(node.config);
  }

  deleteNode(node) {
    this.paper.removeNode(node);
    delete this.nodeMap[node.getId()];
  }

  toJSON() {
    let json = {
      tasks: [],
    };
    _.map(this.nodeMap, node => {
      let nodeJSON = {
        id: node.getId(),
        uuid: node.getId(),
        inputSlots: {},
        outputSlots: {}
      };

      json.tasks.push(nodeJSON);
    });

    console.log(this.nodeMap);
    return json;
  }
}


export default SVGBox;

export {
  SVGBoxPool,
};
