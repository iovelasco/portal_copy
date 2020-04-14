
import * as types from './types';
import axios from 'axios';
import ActionsList from '../../Drawer/component/ActionsList';
import { red } from '@material-ui/core/colors';

const urlGaiaMelimetric = "/api/melimetrics";

export const loadInitialData = () => async (dispatch, getState) => {
  try {
    const initialMetrics = await axios.get(`${urlGaiaMelimetric}/metrics`);
    const finalMetrics = {};
    initialMetrics.data.metrics.forEach((metric) => {
      finalMetrics[metric.id] = metric.display_name
    });
    const initialConfigurations = await axios.get(`/api/charts`, {headers:{ 'X-DSH-Token': getState().token}});
    const finalCharts = initialConfigurations.data.foundCharts.filter((chart) => {
      if (finalMetrics[chart.metric_id]) return true;
      return false;
    }).map((ch2) => {
      return {...ch2, display_name: finalMetrics[ch2.metric_id]}
    });
    dispatch({type: types.LOAD_ALL_INITIAL_DATA, payload: {finalCharts, finalMetrics}});
  } catch (error) {
    console.log(error);
  }
}

export const loadData = () => async function (dispatch) {
  try {
    const res = await axios.get(`${urlGaiaMelimetric}/metrics`);
    dispatch({ type: types.GET_MELIMETRIC_DATA, payload: res.data.metrics});
  } catch (error) {
    console.log(error);
  }
};

export const selectMetric = metrics => async function (dispatch, getState) {
  const existingConfigs = getState().metricConfigurations;
  const hasConfig = existingConfigs.every((cfg) => {
    return cfg.metric_id!=metrics.id
  });
  if (hasConfig) {
    dispatch({ type: types.ADD_NEW_METRIC_CFG, payload: metrics});
  }
}

export const deleteMetric = metricId => async function (dispatch, getState){
  try{
    await axios.delete(`/api/charts`, {headers: { 'X-DSH-Token':getState().token}, data: {metric_id: metricId}});
    dispatch({ type: types.REMOVE_METRIC, payload:metricId });
  }catch(err){
    console.log(err);
  }
}

export const postNewUserConfiguration = (configurations) => async function (dispatch,getState){
  const newConfigs = configurations.map(cfg => {
    const {metric_id, configuration} = cfg;
    return {metric_id, configuration}
  });
  try{   
    await axios.put(`/api/charts`, {configurations: newConfigs}, { headers: { 'X-DSH-Token': getState().token } });
    dispatch({type:types.POST_NEW_USER_CONFIG});
  }catch(err){
    console.log(err);
  }
}

export const updateGraphProperty = (id, property, value) => function (dispatch) {
  dispatch({type: types.UPDATE_GRAPH_PROPERTY, payload: {id, property, value}});
}

export const graphicPayloads = () => async function(dispatch){
  dispatch({type:types.GRAPHIC_PAYLOADS});
}

export const newUserConfiguration = () => async function (dispatch){
  dispatch({type:types.CONFIGURATION,});
};

const tokeMM = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbiI6ImJpbWVsaW1ldHJpY3MiLCJvd25lciI6InJmZXJyYXJpcyIsImlhdCI6MTU2MDg4NTYxN30.EHGEQRQ5-L7T-SUBJQyzCibu4Z-pst9jk-1muZZU1j8'

export const openAlert = (id, metric_name) => async function (dispatch, getState){
  const user_id = getState().userName
  const alertId =  JSON.parse(id)
    dispatch({type:types.SHOW_ALERT, payload:{ id:alertId, metric_name:metric_name }});
    dispatch(getAlertData(alertId, user_id));
}

export const getAlertData =(id, user_id) => async function (dispatch, getState){
  const res = await axios.get(`${urlGaiaMelimetric}/alerts?user_id=${user_id}&metric_id=${id}`, { headers: { 'X-MM-Token': tokeMM } });
  dispatch({type:types.GET_ALERT_DATA, payload:{ alertData:res.data.foundAlerts }});
}

export const closeAlert = () => async function (dispatch){
  dispatch({type:types.HIDE_ALERT});
}

export const deleteAlert = (id, user_id) => async function (dispatch, getState) {
  try{
    await axios.delete(`${urlGaiaMelimetric}/alerts?user_id=${user_id}&metric_id=${id}`, { headers: { 'X-MM-Token': tokeMM } });
    dispatch({ type: types.DELETE_ALERT});
    dispatch(getAlertData(id, user_id));
  }catch (err) {
    console.log();
  }
}

export const settingAlarm = (configAlert) => async function (dispatch, getState) {
  const id = configAlert.metric_id
  const user_id = configAlert.user_id
  try{
    const res = await axios.put(`${urlGaiaMelimetric}/alerts`, configAlert, { headers: { 'X-MM-Token': tokeMM } });
    dispatch({type:types.SETTING_ALERT});
    dispatch(getAlertData(id, user_id));
  }catch (err) {
    console.log(err);
  }
}
