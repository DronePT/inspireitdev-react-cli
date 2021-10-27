import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { routerConfiguration } from './router-configuration';

import './index.css';
import { AppRouter } from './core';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RecoilRoot>
        <AppRouter routes={routerConfiguration} />
      </RecoilRoot>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
