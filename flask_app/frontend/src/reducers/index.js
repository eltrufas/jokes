import { combineReducers } from 'redux';
import { FETCH_USER, FETCH_USER_SUCCESS, FETCH_USER_FAILURE, SET_PAGE,
         RATE_JOKE, RATE_JOKE_SUCCESS, FETCH_PROFILE_SUCCESS } from '../actions/user'

const activeUser = (state = 'unloaded', action) => {
  switch (action.type) {
    case FETCH_USER:
      return 'loading';
    case FETCH_USER_SUCCESS:
      return action.payload.id;
    case FETCH_USER_FAILURE:
      return 'error';
    default:
      return state;
  }
};

const recommendations = (state={}, action) => {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      const new_recs = {}
      action.payload.recommendations.forEach(rec => new_recs[rec.id] = rec);
      return Object.assign({}, state, new_recs);
    case RATE_JOKE_SUCCESS:
      const new_items = {}
      action.payload.recommended.forEach(rec => new_items[rec.id] = rec);
      action.payload.similar.forEach(rec => new_items[rec.id] = rec);
      return Object.assign({}, state, new_items);
    default:
      return state;
  }
};

const topics = (state={}, action) => {
  switch (action.type) {
    case FETCH_PROFILE_SUCCESS:
    case FETCH_USER_SUCCESS:
      const new_topics = {}
      action.payload.topics.forEach(topic => new_topics[topic.id] = topic);
      return Object.assign({}, state, new_topics);
    default:
      return state;
  }
};

const page = (state={current: 'loading'}, action) => {
  if (action.type === SET_PAGE) {
    return {
      current: action.page,
      state: pages[action.page].init(...action.args)
    };
  }

  if (state.current !== 'loading') {
    return Object.assign({}, state, {
      state: pages[state.current].reducer(state.state, action)
    })
  }

  return state
}

const pages = {

  home: {
    init(recs) {
      return {
        recs: recs
      }
    },

    reducer(state, action) {
      return state
    }
  },

  joke: {
    init(jokeId) {
      return {
        joke: jokeId,
        state: 'not_rated'
      }
    },

    reducer(state, action) {
      switch (action.type) {
        case RATE_JOKE:
          return Object.assign({}, state, {state: 'loading_recs'})
        case RATE_JOKE_SUCCESS:
          console.log('hi')
          const recs = action.payload.recommended.map(r => r.id)
          const similar = action.payload.similar.map(r => r.id)
          return Object.assign({}, state, {state: 'loaded_recs', recs, similar});
        default:
          return state
      }
    }
  },

  profile: {
    init(topics) {
      return {topics}
    },

    reducer(state) {
      return state
    }
  }
}

export default combineReducers({
  activeUser,
  recommendations,
  topics,
  page
});
