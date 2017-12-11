import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createUser } from './actions/user'

import createStore from './store'

const store = createStore();
store.dispatch(createUser())

ReactDOM.render((
  <Provider store={store}><App /></Provider>
), document.getElementById('root'));
registerServiceWorker();
