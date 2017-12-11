import { createStore, applyMiddleware } from 'redux';
import rootReducer from  './reducers';
import thunk from 'redux-thunk';


export default(initialState) => {
    return createStore(
      rootReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      applyMiddleware(thunk),
      initialState

    );
}
