import * as d3 from 'd3';
import 'd3-selection-multi';

class Zoomable {
  constructor(node) {
    this.node = node;

    node.transform = {x: 0, y: 0, k: 1};
    let paper = d3.select(node.paper.getXMLNode());
    let {
      width, height,
    } = node.config;

    this.zoom = d3.zoom()
      // 最大放大到2倍，最小0.5倍
      .scaleExtent([0.5, 2])
      .translateExtent([[-width, -height], [width * 2, height * 2]])
      .on('zoom', function() {
        let {
          transform,
        } = d3.event;

        node.transform = transform;
        paper.attr('transform', transform);
      });

    d3.select(node.dom)
      .call(this.zoom)
      // 禁用双击缩放
      .on("dblclick.zoom", null);
  }

  scaleTo(k) {
    this.node.transform.k = k;
    this.zoom.scaleTo(d3.select(this.node.paper.getXMLNode()), k);
  }
}

export default Zoomable;
