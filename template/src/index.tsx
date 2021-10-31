import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { routerConfiguration } from './router-configuration';

import './store';
import './index.css';
import { AppRouter } from './core';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppRouter routes={routerConfiguration} />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
