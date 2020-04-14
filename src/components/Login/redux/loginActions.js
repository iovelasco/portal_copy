import * as types from '../../../store/constants/ActionTypes';


const logUser = (data) => {
  return {
    type: 'USER_LOGGED',
    payload: data
  }
}


const actBu = (id, name) => {
  return {
    type: types.UPDATE_BU,
    bu: {
      id,
      name
    }
  }
}


const actStartLoading = (message) => {
  return {
    type: types.START_LOADING,
    message: message
  }
}

const actEndLoading = () => {
  return {
    type: types.END_LOADING
  }
}

const startLoading = () => (dispatch) => {
  dispatch({type: types.START_LOADING});
}

const endLoading = () => (dispatch) => {
  dispatch({type: types.END_LOADING});
}

const loginType = (value) => {
  return {
    type:types.LOGIN_SUCCESS
  }
} 
const loginAction = () => (dispatch, getState) => {
  const { login } = getState();
  dispatch(loginType(!login));
};

const logoutUser = ()  => {
  localStorage.removeItem("login_data");
  return {
    type: 'USER_LOGGED_OUT'
  }
}

export {
  startLoading,
  endLoading,
  loginAction,
  logUser,
  logoutUser,
};