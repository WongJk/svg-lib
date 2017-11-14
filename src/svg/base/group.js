import _ from 'lodash';
import { createNode } from '../core/svg';

class Group {
  constructor(tagName, className) {

    this.id = this.getId();
    this.box = this.initBox(tagName, className);
  }

  getId() {
    if (!this.id) {
      return Math.random().toString(16).slice(2);
    }
    return this.id;
  }

  initBox(tagName, className = '') {
    let id = this.getId();
    let box = createNode(tagName, {
      class: className,
      id,
    });

    return box;
  }

  update() {}

  getXMLNode() {
    return this.box;
  }

  append(node) {
    if (_.isArray(node)) {
      return _.each(node, item => {
        this.append(item);
      });
    }

    if (_.isFunction(node)) {
      node = node();
    }
    if (node instanceof Group) {
      node = node.getXMLNode();
    }

    console.log(this.box);
    this.box.appendChild(node);
  }

  remove(node) {
    return this.box.removeChild(node);
  }
}

export default Group;
