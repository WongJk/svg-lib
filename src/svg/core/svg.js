import _ from 'lodash';

const doc = window.document;
const xlink = 'http://www.w3.org/1999/xlink';
const ns = 'http://www.w3.org/2000/svg';

const createNode = (name, attrs) => {
  let node = doc.createElementNS(ns, name);
  if (_.isObject(attrs)) {
    setAttributes(node, attrs);
  }
  return node;
};

const setAttribute = (node, key, value) => {
  node.setAttribute(key, value);
};

const setAttributes = (node, attrs) => {
  _.each(attrs, (value, key) => {
    setAttribute(node, key, value);
  });
};

const appendChildren = (node, children) => {
  _.each(children, child => {
    node.appendChild(child);
  });
};

export {
  createNode,
  setAttribute, setAttributes,
  appendChildren,

  xlink, ns,
};
