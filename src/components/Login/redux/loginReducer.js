import * as types from '../../../store/constants/ActionTypes';
import initialStore from '../../../store/initialStore';


const loginReducer = (store = initialStore, action) => {
  const newState = Object.assign({}, store);
  switch (action.type) {
    case types.LOGIN_SUCCESS:
    return { ...newState, login: action.value }
  case types.USER_LOGGED:
    return Object.assign({}, store, {token: action.payload.token, userName: action.payload.user_id, loginUserSucces: true});
  case 'USER_LOGGED_OUT':
    return Object.assign({}, store, {token: undefined, user: undefined, loginUserSucces: false, buName: undefined, faqs: undefined, introduction: {}, sections: undefined, key_users: undefined, currentPage: 'introduction', currentDashboard: undefined });
    default:
      return store
  }
}

export default loginReducer