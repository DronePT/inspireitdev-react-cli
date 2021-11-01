import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './store';

import { routerConfiguration } from './router-configuration';
import { AppRouter } from './core';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppRouter routes={routerConfiguration} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
