import _ from 'lodash';
import Shape from '../base/shape';

const segment2String = segment => {
  if (_.isString(segment)) {
    return segment;
  }

  if (!_.isArray(segment)) {
    return '';
  }

  let [command, ...data] = segment;
  return `${ command }${ data.join(',') }`;
}

class PathDrawer {

  constructor(path) {
    this.path = path;
  }

  clear() {
    this.path.setPathData(null);
  }

  push(...segment) {
    let originData = this.path.getPathData();
    let newData = segment2String(segment);
    this.path.setPathData(originData + newData);

    return this;
  }
};

class Path extends Shape {
  constructor() {
    super('path');

    this.pathData = '';
  }

  setPathData(data) {
    data = data || 'M0,0';

    this.pathData = segment2String(data);
    this.node.setAttribute('d', this.pathData);
  }

  getPathData() {
    return this.pathData;
  }

  getDrawer() {
    return new PathDrawer(this);
  }
}

export default Path;
