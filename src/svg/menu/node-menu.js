import _ from 'lodash';

const doc = window.document;

const hideDOM = dom => {
  dom.setAttribute(
    'style', `display: none;`
  );
};

class NodeMenu {
  constructor(box) {
    this.box = box;

    this.dom = null;
    this.currentNode = null;
  }

  setDOM(dom) {
    this.dom = dom;
  }

  show({ x, y }, node) {
    console.log(node);

    // 先隐藏所有menu
    _.each(doc.querySelectorAll('.context-menu'), dom => hideDOM(dom));

    if (!this.dom) {
      console.error('can not find menu dom!');
      return;
    }

    this.currentNode = node;
    this.dom.setAttribute(
      'style', `display: block; left: ${ x }px; top: ${ y }px;`
    );
  }

  hide() {
    this.currentNode = null;
    hideDOM(this.dom);
  }

  copyNode() {
    if (!this.currentNode) {
      return;
    }
    this.box.copyNode(this.currentNode);
  }

  deleteNode() {
    if (!this.currentNode) {
      return;
    }
    this.box.deleteNode(this.currentNode);
  }
}

export default NodeMenu;
