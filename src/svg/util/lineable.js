import * as d3 from 'd3';
import 'd3-selection-multi';

import _ from 'lodash';

import Pool from '../base/pool';
import ArrowDrawer, { getSlotXY } from './arrow-drawer';

/**
 * 存放 InputSlot 的池子
 * 用来检索 当前正在画的线 可以被连到哪个slot上
 */
class InputSlotPool extends Pool {
  // 查找可以跟 startSlot 连接的slot
  // 找距离最近的
  findEndSlot({x, y}, startSlot) {
    // d3.event.x|y 是经过 相对parentNode偏移之后的
    // 所以还需要 获得经过 transform 之后的 鼠标坐标
    x += startSlot.transform.x;
    y += startSlot.transform.y;

    let slotArr = _.map(this.get(), (slot, id) => {
      // 2个属于 相同node 的slot 不可以被连接
      if (slot.parentBox === startSlot.parentBox) {
        return false;
      }
      // 如果当前slot已经被软删除了，则忽略
      if (slot === false) {
        return false;
      }

      let slotXY = getSlotXY(slot);
      let dx = slotXY.x - x;
      let dy = slotXY.y - y;

      let distance = dx * dx + dy * dy;
      // 设定：距离在 33以内，才可以连接
      if (distance > 33 * 33) {
        return false;
      }

      return {
        slot,
        distance,
      };
    });
    slotArr = _.compact(slotArr);
    slotArr.sort((slot1, slot2) => slot1.distance - slot2.distance);

    let closest = _.first(slotArr);
    return closest && closest.slot;
  }
}

class Lineable {
  constructor(slot, type, startCb, dragCb, endCb) {
    this.slot = slot;
    this.type = type;

    // 初始化slot的transform位置
    slot.transform = slot.transform || {
      x: 0, y: 0,
    };

    let arrowBox = slot.parentBox.paper.arrowBox;
    // 获得当前 纸上 的 输入节点pool
    let pool = slot.parentBox.paper.inputSlotPool;

    // 当前slot是 输出点，则可以 连出线
    if (type === 'output') {
      this.drag = d3.drag();
      this.drawer = new ArrowDrawer(slot, arrowBox);

      // 防止this丢失，引入作用域链上的 局部变量
      let drawer = this.drawer;

      this.drag.on('start', function() {
        drawer.start(d3.event);

        d3.event
          .on('drag', function() {
            drawer.drawTo(d3.event);
          })
          .on('end', function() {
            // 找到合适的endSlot
            let endSlot = pool.findEndSlot(d3.event, slot);
            // 如果没有找到 合适的 slot
            if (!endSlot) {
              drawer.done();
              return false;
            }
            // 在池子中软删除 当前找到的end
            pool.softRemove(endSlot.getId());

            // 把线连到 终点的 中心
            drawer.done(endSlot);

            // 把end的drawer跟start的统一
            endSlot.drag.drawer = drawer;
          });

      });

      let box = slot.getXMLNode();
      d3.select(box).call(this.drag);
    }
    // 非输出点（如输入点）不可以连出线
    // 但是可以 被连入线
    else {
      this.drawer = null;
      pool.add(slot.getId(), slot);
    }

  }

  reset() {
    let pool = this.slot.parentBox.paper.inputSlotPool;

    if (this.type === 'output') {
      this.drawer.clear();
    }
    else {
      this.drawer = null;
      pool.add(this.slot.getId(), this.slot);
    }
  }

  destory() {
    console.log('distory:', this);

    if (this.type === 'output') {
      _.each(this.drawer.arrows, ({ endSlot }) => {
        endSlot.drag.reset();
      });
      this.reset();
    }
    else {
      // 存在 this.drawer 为null的情况
      // 即 当前inputSlot未被 连入
      if (this.drawer) {
        let startSlot = this.drawer.startSlot;
        startSlot.drag.drawer.deleteArrowByEndSlot(this.slot);
      }
      this.reset();
    }
  }
}

export {
  InputSlotPool,
};

export default Lineable;
