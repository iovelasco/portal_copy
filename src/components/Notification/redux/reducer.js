import * as types from './types';

const initialStore = {
  notification: { status: null, list: undefined },
}

const notificationReducer = (store = initialStore, action) => {
  switch (action.type) {
    case types.ACTIVE_NOTIFICATION:
      return  Object.assign({}, store, { notification: { ...store.notification, status: !action.payload.notification } });
    case types.NOTIFICATION_LOADED:
      return Object.assign({}, store, { notification: { ...store.notification, list: action.payload } });
    case types.NOTIFICATION_READ:
      return Object.assign({}, store, { notification: { ...store.notification, list: action.payload } });
    default:
      return store;
  }
};

export default notificationReducer;
