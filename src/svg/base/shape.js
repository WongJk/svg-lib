import Event from '../core/event';
import { createNode } from '../core/svg';

class Shape extends Event {
  constructor(tagName) {
    super();

    this.node = createNode(tagName);
  }

}

export default Shape;
