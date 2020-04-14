import * as types from '../../../store/constants/ActionTypes';
import axios from 'axios';
import { token } from '../../../furyToken';
import { loadFavorite, loadSubscriptions } from '../../Pages/redux/pagesAction';

const logoutUser = () => {
  localStorage.removeItem("login_data");
  return {
    type: types.USER_LOGGED_OUT
  }
}

const logUser = (data) => {
  return {
    type: types.USER_LOGGED,
    payload: data
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

const actUpdateDashboard = (dashboards, page) => {
  return {
    type: types.UPDATE_DASHBOARDS,
    payload: {...dashboards, "page": page}
  }
}

const updateDashboards = (bu, page) => {
  return async function (dispatch, getState) {
    dispatch(actStartLoading('Loading Dashboards'));
    const ld = localStorage.getItem("login_data");
    if (ld) {
      try {
        await axios.get('/api/authenticate/alive', { headers: { 'X-DSH-Token': JSON.parse(ld).token } });
        dispatch(logUser(JSON.parse(ld)));
        dispatch(loadFavorite(bu));
        dispatch(loadSubscriptions(bu));
        if (bu) dispatch({ type: types.UPDATE_BU, payload: bu });
        const businessUnit = getState().buId;
        try {
          const dashsUnits = await axios.get(`/api/business_units/${businessUnit}`, { headers: { 'X-DSH-Token': JSON.parse(localStorage.getItem("login_data")).token } });
          dispatch(actUpdateDashboard(dashsUnits.data, page));
        } catch (error) {
        }
        dispatch(actEndLoading());
      } catch (error) {
        localStorage.removeItem("login_data");
        dispatch(logoutUser());
        
      }
    } else {
      dispatch(logoutUser());
    }

  }
}

const createDashboard = (data, bu_id) => {
  return async function (dispatch, getState) {
    dispatch({ type: types.START_DASHBOARD_CREATION });
    let resultDashboard;
    if (data.id) {
      resultDashboard = data.id;
      const finalId = data.id;
      delete data.id;  
      await axios.put(`/api/business_units/${bu_id}/dashboards/${finalId}`, { ...data }, { headers: { 'X-DSH-Token': getState().token } });
    } else {
      data.bu_id = getState().buId;
      const rd = await axios.post(`/api/business_units/${bu_id}/dashboards`, { ...data }, { headers: { 'X-DSH-Token': getState().token } });
      resultDashboard = rd.data.dashboard_id;
    }
    dispatch({ type: types.END_DASHBOARD_CREATION, payload: {dashboard_id: resultDashboard } });
    dispatch(updateDashboards())
  }
}

const actUpdateBus = (bus) => {
  return {
    type: types.UPDATE_BUS,
    bus
  }
}


const updateBus = () => {
  return async function(dispatch, getState) {
    dispatch({type: types.START_EDITING});
    const bus = await axios.get(`/api/business_units`, {headers: {'Content-Type': 'application/json', 'X-Auth-Token': token}});
    dispatch(actUpdateBus(bus.data.business_units));
    dispatch({type: types.END_EDITING});
  }
}

const updateBu = (id, name) => {
  return async function(dispatch, getState) {
    try {
      dispatch({type: types.START_EDITING});
      await axios.put(`/api/business_units/${id}`, {"bu_name": name}, {headers: {'X-Auth-Token': token}});
      dispatch(updateBus());
      dispatch({type: types.END_EDITING});
    } catch (error) {
      dispatch({type: types.END_EDITING});
    }
  }
}


const createNewBu = (name) => {
  return async function(dispatch) {
    try {
      dispatch({type: types.START_EDITING});
      await axios.post('/api/business_units', {"bu_name": name});
      dispatch(updateBus());
    } catch (error) {
      dispatch({type: types.END_EDITING});
    }
  }
}

const updatePageAdmin = (page) => {
  return function(dispatch) {
    dispatch({type: types.CHANGE_PAGE_ADMIN, payload: page});
  }
}

export {
  updateDashboards,
  createDashboard,
  updateBus,
  updateBu,
  createNewBu,
  updatePageAdmin,
  actUpdateBus
};