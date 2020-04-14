/* eslint-disable */
import * as types from './types';
import axios from 'axios';
import { updateBus, updateDashboards } from '../../DashboardConfig/redux/DashboardConfigActions'

export const createNewKU = (bu_id, data) => {
  return async function (dispatch, getState) {
    dispatch({ type: types.START_ADDING_KU });
    const nuevoKu = await axios.post(`/api/business_units/${bu_id}/key_users`, { ...data }, { headers: { 'X-DSH-Token': getState().token } });
    dispatch({ type: types.END_ADDING_KU, payload: { ...data, ku_id: nuevoKu.data.ku.ku_id } });
  }
}

export const updateIntroduction = (bu_id, introduction) => {
  return async function (dispatch, getState) {
    try {
      dispatch({ type: types.START_EDITING_INTRODUCTION });
      await axios.put(`/api/business_units/${bu_id}/introduction`, { ...introduction }, { headers: { 'X-DSH-Token': getState().token } });
      dispatch({ type: types.END_EDITING_INTRODUCTION, payload: introduction });
    } catch (error) {
      dispatch({ type: types.END_EDITING_INTRODUCTION });
    }
  }
}

export const loadFavorite = (bu) => {
  return async function (dispatch, getState) {
    try {
      console.log(getState());
      dispatch({ type: types.START_LOAD_FAVORITE })
      const res = await axios.get(`/api/business_units/${bu}/favourites`, { headers: { 'X-DSH-Token': getState().token } })
      dispatch({ type: types.LOAD_FAVORITE, payload: res.data.favourites })
    } catch (error) {
      dispatch({ type: types.LOAD_FAVORITE })
    }
  }
}

export const loadSubscriptions = (bu) => {
  return async function (dispatch, getState) {
    try {
      const res = await axios.get(`/api/business_units/${bu}/subscriptions`, { headers: { 'X-DSH-Token': getState().token } })
      dispatch({ type: types.LOAD_SUBSCRIPTION, payload: res.data.subscriptions })
    } catch (error) {
      dispatch({ type: types.LOAD_SUBSCRIPTION})
    }
  }  
}

export const deleteFavorite = (dashboard_id, bu_id) => {
  return async function (dispatch, getState) {
    try {
      const res = await axios.delete(`/api/business_units/${bu_id}/favourites/${dashboard_id}`, { headers: { 'X-DSH-Token': getState().token } })
      dispatch(loadFavorite(bu_id))
    } catch (error) {
      dispatch({ type: types.DELETE_FAVORITE })
    }
  }
}

export const addFavorite = (dashboard_id, bu_id) => {
  return async function (dispatch, getState) {
    try {
      const res = await axios.post(`/api/business_units/${bu_id}/favourites`, { "dashboard_id": dashboard_id }, { headers: { 'X-DSH-Token': getState().token } })
      dispatch({ type: types.ADD_FAVORITE, payload: res.data.favourites })
      dispatch(loadFavorite(bu_id))
    } catch (error) {
    }
  }
}

export const loadDashboardData = (bu_id, search_term) => {
  return async function (dispatch, getState) {
    try {
      const search = await axios.get(`/business_units/${bu_id}/metrics?name=${search_term.toLowerCase()}`, { headers: { 'X-DSH-Token': getState().token } });
      dispatch({ type: types.LOAD_DATA_DASHBOARD, payload: search.data })
    } catch (error) {
    }
  };
}

export const createNewFAQ = (bu_id, data) => {
  return async function (dispatch, getState) {
    try {
      dispatch({ type: types.START_ADDING_FAQ });
      const resp = await axios.post(`/api/business_units/${bu_id}/faq`, { ...data }, { headers: { 'X-DSH-Token': getState().token } });
      dispatch({ type: types.END_ADDING_FAQ, payload: { id: resp.data.createdFaq.faq_id, question: resp.data.createdFaq.question, answer: resp.data.createdFaq.answer } });
    } catch (error) {
      dispatch({ type: types.END_ADDING_FAQ });
    }
  }
}

export const deletedFAQ = (bu_id, id_faq) => {
  return async function (dispatch, getState) {
    try {
      await axios.delete(`/api/business_units/${bu_id}/faq/${id_faq}`, { headers: { 'X-DSH-Token': getState().token } });
      dispatch(updateDashboards(getState().buId, 'faq'));
    } catch (error) {
      dispatch({ type: types.FAQ_NOT_DELETED })
    }
  }
}

export const updateCurrentSection = () => {
  console.log()
}



export const deleteSection = (sectionId) => {
  return async function (dispatch, getState) {
    try {
      const deleteSection = await axios.delete(`/api/business_units/${getState().buId}/sections/${sectionId}`, { headers: { 'X-DSH-Token': getState().token } });
      dispatch({type: types.DELETE_SECTION})
    } catch (err) {
      dispatch({type: types.NOT_POSIBLE_DELETE_SECTION, payload:"The section is parent from other sections"})
      console.log(err)
    }
  }
}