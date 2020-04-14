import * as types from './types';
import axios from 'axios';

const loadNotification = () => async function (dispatch, getState) {
  const token = getState().token;
  try {
    dispatch({ type: types.START_LOAD_NOTIFICATION });
    const res = await axios.get(`/api/notifications`, { headers: { 'X-DSH-Token': token } });
    dispatch({ type: types.NOTIFICATION_LOADED, payload: res.data.notifications });
  } catch (error) {
    dispatch({ type: types.ERROR_LOAD_NOTIFICATION });
  }
};

const readNotification = (id) => async function (dispatch, getState) {
  const token = getState().token;
  try {
    const res = await axios.put(`/api/notifications/${id}`, {}, { headers: { 'X-DSH-Token': token } });
    dispatch({ type: types.NOTIFICATION_READ, payload: res.data.notifications });
  } catch (error) {
    dispatch({ type: types.ERROR_LOAD_NOTIFICATION });
  }
};

const activeNotification = () => (dispatch, getState) => {
  const notification = getState().notification.status;
  dispatch({ type: types.ACTIVE_NOTIFICATION, payload: { notification: notification } });
};

export {
  activeNotification,
  loadNotification,
  readNotification,
};
