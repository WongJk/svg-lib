const IS_PRODUCTION = process.env.IS_PRODUCTION === 'true';

import * as d3 from 'd3';
import 'd3-selection-multi';
import _ from 'lodash';

if (!IS_PRODUCTION) {
  window.d3 = d3;
  console.log(d3);
}

import { SVGBoxPool } from './svg-box';
import NodeMenu from './menu/node-menu';
const pool = new SVGBoxPool();

const addNode = (nodeConfig, box = pool.getActiveBox()) => {

  // 增加右键点击菜单
  let {
    event,
  } = nodeConfig;
  // 如果没有在config中禁用掉 右键，则增加默认右键菜单
  if (event && event.contextmenu !== false) {
    event.contextmenu = (e, node) => {
      e.stopPropagation();
      e.preventDefault();
      let x = e.clientX;
      let y = e.clientY;
      box.nodeMenu.show({ x, y }, node);
    };
  }

  return box.addNode(nodeConfig);
};

const removeNode = (node, box = pool.getActiveBox()) => {
  return box.removeNode(node);
};

const moveNode = (node, {dx, dy}, box = pool.getActiveBox()) => {
  return box.moveNode(node, {dx, dy});
};

export {
  // 提供一个 单例模式，供全局来调用
  pool,

  addNode, removeNode,
  moveNode,
};
