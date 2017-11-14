
import * as d3 from 'd3';
import 'd3-selection-multi';

// 更新 上层 slot
const updateUpperSlot = node => {
  let { x, y } = node.transform;
  let { upper } = node.slots;
  _.each(upper, slot => {
    slot.transform = {
      x, y,
    };
    // 上层slot被连接后，drawer才会非空
    // 未被连接时，是不需要更新的
    if (slot.drag.drawer) {
      slot.drag.drawer.updateEnd();
    }
  });
};
// 更新 下层 slot
const updateBelowSlot = node => {
  let { x, y } = node.transform;
  let { below } = node.slots;
  _.each(below, slot => {
    slot.transform = {
      x, y,
    };
    slot.drag.drawer.updateStart();
  });
};

/**
 * 更新node里的各个slot所连的arrow的位置
 */
const updateSlotArrow = node => {
  updateUpperSlot(node);
  updateBelowSlot(node);
};

/**
 * 更新 node 的 transform属性
 * 同时更新 node 子节点的一些位置等信息
 */
const updateNodeTransform = (node, {dx, dy}) => {
  let {
    x, y,
  } = node.transform;
  // 增加偏移量
  x += dx;
  y += dy;

  // 更新js属性
  node.transform = {
    x, y,
  };
  updateSlotArrow(node);

  // 更新dom属性
  let box = node.getXMLNode();
  d3.select(box).attrs({
    transform: `translate(${ x }, ${ y })`,
  });
};

class Dragable {
  constructor(node, startCb, dragCb, endCb) {
    this.drag = d3.drag();

    // 初始化node的transform位置
    node.transform = node.transform || {
      x: 0, y: 0,
    };
    // 把node默认的位置用 偏移量的形式 更新到 transform 和其slot
    updateNodeTransform(node, {
      dx: node.config.x,
      dy: node.config.y,
    });

    const doDrag = (node, event, cb, context) => {
      // console.log(d3.event);
      updateNodeTransform(node, event);
      cb && cb(event, context);
    };

    this.drag.on('start', function() {
      doDrag(node, d3.event, startCb, this);

      d3.event
        .on('drag', function() {
          doDrag(node, d3.event, startCb, this);
        })
        .on('end', function() {
          doDrag(node, d3.event, startCb, this);
        });
    });

    let box = node.getXMLNode();
    d3.select(box).call(this.drag);
  }
}

export default Dragable;
export {
  updateUpperSlot, updateBelowSlot,
  updateSlotArrow,

  updateNodeTransform,
};
