import React from 'react';

import { Slider, Icon } from 'antd';

import * as svg from '../svg';
import { SVGBoxPool, nodeContextMenu } from '../svg/svg-box';

import './index.less';
import '../svg/index.less';

class SVGBlock extends React.Component {
  constructor(props) {
    super(props);

    this.box = null;

    this.state = {
      scale: 1,
    };
  }

  componentDidMount() {
    let {
      width, height,
    } = this.svgDOM.getBoundingClientRect();


    this.box = svg.pool.createBox({ width, height }, true);
    this.box.enterDOM(this.svgDOM);

    this.box.nodeMenu.setDOM(this.nodeContextMenuDOM);

    this.box.addNode({
      text: 1,
      x: 10, y: 10,
    });

    this.box.addNode({
      text: 2,
      x: 20, y: 100,
    });
  }

  clickSVGBox = () => {
    this.box.nodeMenu.hide();
    this.svgContextMenuDOM.setAttribute('style', 'display: none;');
  }

  showSVGContextMenu = e => {
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;
    this.box.nodeMenu.hide();

    this.svgContextMenuDOM.setAttribute(
      'style', `display: block; left: ${ x }px; top: ${ y }px`
    );
  };

  copyNode = () => {
    this.box.nodeMenu.copyNode();
    this.box.nodeMenu.hide();
  }

  deleteNode = () => {
    this.box.nodeMenu.deleteNode();
    this.box.nodeMenu.hide();
  }

  changeSVGScale = scale => {
    this.setState({
      scale,
    });
    // TODO: change box scale
    // 解决 translate问题，防止缩放后 再拖拽出现闪动
    this.box.scaleTo(scale);
  }

  saveSVG = () => {
    let json = this.box.toJSON();
    console.log(json);
  }

  render() {

    return (
      <div className="svg-block">
        <div
          className="svg-box"
          ref={ref => {this.svgDOM = ref}}
          onClick={this.clickSVGBox}
          onContextMenu={this.showSVGContextMenu}
        ></div>

        <div className="tool-bar">
          <div className="scale-slider">
            <Slider
              value={this.state.scale} step={0.5}
              min={0.5} max={2}
              onChange={this.changeSVGScale}
            />
          </div>
        </div>

        <div className="button-bar">
          <Icon type="save" onClick={this.saveSVG} />
          <Icon type="edit" onClick={() => {

          }}/>
        </div>

        <div
          className="context-menu"
          id="context-menu-svg"
          ref={ref => this.svgContextMenuDOM = ref}
        >
          <p>复制</p>
          <p>粘贴</p>
          <p>删除</p>
        </div>
        <div
          className="context-menu"
          id="context-menu-node"
          ref={ref => this.nodeContextMenuDOM = ref}
        >
          <p onClick={this.copyNode}>复制</p>
          <p onClick={this.deleteNode}>删除</p>
          <p>运行当前任务</p>
          <p>从当前任务开始运行</p>
          <p>运行到当前任务</p>
          <p>查看运行信息</p>
          <p>查看log</p>
        </div>
      </div>
    );
  }
}

export default SVGBlock;
