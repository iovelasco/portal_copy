import * as types from './types';

const initialStore = {
  userName: undefined,
  token: undefined,
  tokenInfo:undefined,
  user: undefined,
  errorOnLogin:undefined,
  loginUserSucces: true,
  business_unit:[]
}

const login = (store = initialStore, action) => {
  switch (action.type) {
    case types.GET_AUTHENTICATE_ALIVE:
      return {...store, tokenInfo:action.payload.data.info}
    case types.LOGIN_SUCCESS:
      return {...store, token: action.payload.data.token, userName: action.payload.data.user_id, loginUserSucces: true };
    case types.USER_LOGGED_OUT:
      return {...store, token: undefined, user: undefined, loginUserSucces: false, buName: undefined, faqs: undefined, introduction: {}, sections: undefined, key_users: undefined, currentPage: 'introduction', currentDashboard: undefined };
    case types.GET_BU:
      console.log('action.payload', action.payload)
      return {...store, business_unit:action.payload};
    default:
      return store
  };
};

export default login