import * as d3 from 'd3';
import 'd3-selection-multi';
import _ from 'lodash';
import { createNode, setAttributes } from '../core/svg';

const getSlotXY = slot => {
  let {
    config: { cx, cy },
    transform: { x, y },
  } = slot;

  return {
    x: x + cx,
    y: y + cy,
  };
};

// 计算 path的d属性中的 C字段，画出 贝塞尔曲线
const getBezierC = (startXY, endXY) => {
  const d = 1.0 / 4;
  const l = 50;

  let lenx = endXY.x - startXY.x;
  let leny = endXY.y - startXY.y;

  // 判断 start end 的左右 来获得横向的 偏移量
  let dx = lenx > 0 ? -l : l;
  let x1 = startXY.x + lenx * d + dx;
  let x2 = startXY.x + lenx * (1 - d) - dx;

  let y1 = startXY.y + leny * d;
  let y2 = startXY.y + leny * (1 - d);
  return `${x1},${y1} ${x2},${y2} ${endXY.x},${endXY.y}`;
};
const getBezierPathD = (startXY, endXY) => {
  let c = getBezierC(startXY, endXY);
  let {x, y} = startXY;
  return `M${x},${y} C${c}`;
};

class ArrowDrawer {
  constructor(startSlot, arrowBox) {

    // arrow所需要画在的 dom 里
    this.arrowBox = arrowBox;

    // 箭头开始的node（slot)
    this.startSlot = startSlot;

    // 画线时，笔的位置
    this.drawingXY = {
      x: 0, y: 0
    };

    this.arrows = {};
    this.curArrow = null;
  }

  start() {
    // 如果第一次开始画，则初始化 arrow
    if (!this.curArrow) {
      this.curArrow = createNode('path', {
        class: 'slot-line',
      });
      this.arrowBox.append(this.curArrow);
    }

    let { x, y } = getSlotXY(this.startSlot);
    // 起点位置+位移量，即默认slot的中心位置
    this.drawingXY = { x, y };

    // TODO: bezier 曲线
    setAttributes(this.curArrow, {
      d: `M${x},${y}`
    });
  }

  drawTo({dx, dy}) {
    // 如果没在画，则不画
    if (!this.curArrow) {
      return;
    }

    this.drawingXY = {
      x: this.drawingXY.x + dx,
      y: this.drawingXY.y + dy,
    };

    let startXY = getSlotXY(this.startSlot);
    setAttributes(this.curArrow, {
      d: getBezierPathD(startXY, this.drawingXY),
    });
  }

  done(endSlot) {
    // 如果没在画，则不画
    if (!this.curArrow) {
      return;
    }

    // 如果结束时，没有连到end点上，则回到start的状态，并结束
    if (!endSlot) {
      let { x, y } = getSlotXY(this.startSlot);
      this.drawingXY = { x, y };

      // 回到start的状态
      setAttributes(this.curArrow, {
        d: `M${x},${y}`
      });
      return;
    }

    let startXY = getSlotXY(this.startSlot);
    // 把线 连到 end slot上
    let { x, y } = getSlotXY(endSlot);
    setAttributes(this.curArrow, {
      d: getBezierPathD(startXY, {x, y}),
    });

    this.arrows[endSlot.getId()] = {
      line: this.curArrow,
      endSlot,
    };
    this.curArrow = null;
  }

  clear() {
    _.each(this.arrows, ({ line }) => {
      this.arrowBox.remove(line);
    });
    if (this.curArrow) {
      this.arrowBox.remove(this.curArrow);
    }

    this.arrows = {};
    this.curArrow = null;
  }

  deleteArrowByEndSlot(endSlot) {
    let slotId = endSlot.getId();
    let arrow = this.arrows[slotId];
    delete this.arrows[slotId];
    this.arrowBox.remove(arrow.line);
  }

  updateStart() {
    let startSlotXY = getSlotXY(this.startSlot);

    _.each(this.arrows, ({ line, endSlot }) => {
      let endSlotXY = getSlotXY(endSlot);
      setAttributes(line, {
        d: getBezierPathD(startSlotXY, endSlotXY),
      });
    });
  }

  updateEnd() {
    this.updateStart();
  }
}

export {
  getSlotXY,
};

export default ArrowDrawer;
