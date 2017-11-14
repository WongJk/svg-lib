import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import SVGBlock from './SVGBlock';

const renderApp = () => {
  ReactDOM.render(
    <SVGBlock />,
    document.getElementById('app')
  );
};

renderApp();

if (module && module.hot) {
  module.hot.accept([
    './SVGBlock',
  ], () => {
    renderApp();
  });
}
