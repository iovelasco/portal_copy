/* eslint-disable */
import * as types from './types';
import axios from 'axios';
import { token } from '../../../furyToken';
import {updateDashboards} from '../../DashboardConfig/redux/DashboardConfigActions';

export const createNewKU = (bu_id, data) => {
  return async function(dispatch, getState) {
    dispatch({type: types.START_ADDING_KU});
    const nuevoKu = await axios.post(`/api/business_units/${bu_id}/key_users`, {...data} ,{headers:{'X-DSH-Token': getState().token}});
    console.log(nuevoKu);
    dispatch({type: types.END_ADDING_KU ,payload: {...data, ku_id: nuevoKu.data.ku.ku_id}});
  }
}

export const createNewMetric = (bu_id, data, dshToken) => {
  return async function(dispatch) {
    try {
      dispatch({type: types.START_ADDING_METRIC});
      await axios.post(`/api/business_units/${bu_id}/metrics`, {...data}, {headers: {'X-DSH-Token': dshToken}});
      dispatch({type: types.END_ADDING_METRIC});
    } catch (error) {
      console.log(error);
      if (!error.hasOwnProperty('response')) dispatch({type: types.END_ADDING_METRIC, payload: 'Error de conexion con el backend.'});
      else dispatch({type: types.END_ADDING_METRIC, payload: error.response.data.error.message});
    }
  }
}

export const createNewSection = (bu_id, section_name, parent_section_id) => {
  return async function(dispatch, getState) {
    dispatch({type: types.START_ADDING_SECTION});
    await axios.post(`/api/business_units/${bu_id}/sections`, {section_name, parent_section_id}, {headers: {'X-DSH-Token': getState().token}});
    dispatch({type: types.END_ADDING_SECTION});
    dispatch(updateDashboards(bu_id));
  }
}

