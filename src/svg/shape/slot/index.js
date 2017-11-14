import Slot from './slot';

class InputSlot extends Slot {
  /**
   * [constructor description]
   * @param  {[type]} cx               [description]
   * @param  {[type]} cy               [description]
   * @param  {[type]} text             [description]
   * @param  {[type]} [parentBox=null] 输入|出 slot所在的 node
   * @return {[type]}                  [description]
   */
  constructor({cx, cy, text}, parentBox = null) {
    super({cx, cy, text}, 'input', parentBox, {
      className: 'input-slot',
    });
  }
}

class OutputSlot extends Slot {
  constructor({cx, cy, text}, parentBox = null) {
    super({cx, cy, text}, 'output', parentBox, {
      className: 'output-slot',
    });
  }
}

export {
  InputSlot, OutputSlot,
};

export default Slot;
