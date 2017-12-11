export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const setUser = (user_id) => {
  return dispatch => {
    dispatch({ type: FETCH_USER });

    return fetch(`/api/user/${user_id}`)
      .then(res => res.json())
      .then(payload => {
        dispatch({ type: FETCH_USER_SUCCESS, payload });
        dispatch(setPage('home', payload.recommendations.map(r => r.id)));
      })
      .catch(err => {
        dispatch({ type: FETCH_USER_FAILURE });
      });
  };
}

export const createUser = () => {
  return dispatch => {
    dispatch({ type: FETCH_USER });

    return fetch(`/api/user`, { method: 'post' })
      .then(res => res.json())
      .then(payload => {
        dispatch({ type: FETCH_USER_SUCCESS, payload });
        dispatch(setPage('home', payload.recommendations.map(r => r.id)));
      })
      .catch(err => {
        dispatch({ type: FETCH_USER_FAILURE });
      });
  }
}

export const FETCH_PROFILE = 'FETCH_PROFILE';
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
export const FETCH_PROFILE_FAILURE = 'FETCH_PROFILE_FAILURE';

export const goToProfile = () => {
  return (dispatch, getState) => {

    const user_id = getState().activeUser;
    dispatch({ type: FETCH_PROFILE });

    return fetch(`/api/user/${user_id}`)
      .then(res => res.json())
      .then(payload => {
        dispatch({ type: FETCH_PROFILE_SUCCESS, payload });
        dispatch(setPage('profile', payload.topics.map(r => r.id)));
      })
      .catch(err => {
        dispatch({ type: FETCH_PROFILE_FAILURE });
      });
  }
}



export const SET_PAGE = 'SET_PAGE'

export const setPage = (page, ...args) => {
  return { type: SET_PAGE, page, args}
}

export const RATE_JOKE = 'RATE_JOKE';
export const RATE_JOKE_SUCCESS = 'RATE_JOKE_SUCCESS';
export const RATE_JOKE_FAILURE = 'RATE_JOKE_FAILURE';

export const rateJoke = (jokeId, rating) => {
  return (dispatch, getState) => {
    const userId = getState().activeUser;
    dispatch({ type: RATE_JOKE });

    return fetch(`/api/user/${userId}/rating/${jokeId}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rating)
    })
      .then(res => res.json())
      .then(payload => {
        dispatch({ type: RATE_JOKE_SUCCESS, payload });
      })
      .catch(err => {
        console.error(err)
        dispatch({ type: RATE_JOKE_FAILURE });
      });
  }
}
